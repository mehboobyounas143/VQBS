import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels);

const AdminReports = () => {
  const [responses, setResponses] = useState([]);
  const [reportData, setReportData] = useState({});
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`${process.env.REACT_APP_BACKEND_URL}api/students`)
      .then(response => {
        setStudents(response.data.students);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching students');
        toast.error('Error fetching students');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedStudent) {
      setResponses([]);
      setReportData({});
      setError(null);
      setStudent(null);
      return;
    }

    setLoading(true);
    Promise.all([
      axios.get(`${process.env.REACT_APP_BACKEND_URL}api/students/${selectedStudent}`),
      axios.get(`${process.env.REACT_APP_BACKEND_URL}api/responses/student/${selectedStudent}`)
    ]).then(([studentRes, responsesRes]) => {
      setStudent(studentRes.data.student);
      setResponses(responsesRes.data.responses);
      setError(null);
      setLoading(false);
    }).catch((err) => {
      if (err.response?.status === 404) {
        setResponses([]);
        setReportData({});
        toast.error('No responses found.');
      } else {
        setError('Error fetching data.');
        toast.error('Error fetching data.');
      }
      setLoading(false);
    });
  }, [selectedStudent]);

  useEffect(() => {
    if (responses.length === 0) {
      setReportData({});
      return;
    }

    const grouped = responses.reduce((acc, res) => {
      const subjectName = res.subjectId?.subjectName || 'Unknown';
      if (!acc[subjectName]) acc[subjectName] = { correct: 0, total: 0 };
      acc[subjectName].total++;
      if (res.isCorrect) acc[subjectName].correct++;
      return acc;
    }, {});

    const report = {};
    for (const subject in grouped) {
      const { correct, total } = grouped[subject];
      const accuracy = ((correct / total) * 100).toFixed(2);
      report[subject] = { correct, total, accuracy };
    }
    setReportData(report);
  }, [responses]);

  const barChartData = {
    labels: Object.keys(reportData),
    datasets: [{
      label: 'Accuracy (%)',
      data: Object.values(reportData).map(item => item.accuracy),
      backgroundColor: '#27ae60',
      borderColor: 'white',
      borderWidth: 2,
      barThickness: 50
    }]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: context => `${context.raw}%`
        }
      },
      datalabels: {
        color: 'white',
        anchor: 'end',
        align: 'start',
        formatter: value => `${value}%`,
        font: { weight: 'bold' }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Subjects', color: '#2c3e50', font: { size: 14 } },
        ticks: { color: '#34495e', font: { size: 13 } }
      },
      y: {
        title: { display: true, text: 'Percentage (%)', color: '#2c3e50', font: { size: 14 } },
        min: 0,
        max: 100,
        ticks: { stepSize: 10, color: '#34495e', font: { size: 13 } }
      }
    }
  };

  const downloadPDF = () => {
    setGeneratingPDF(true);
    const input = document.getElementById('report-content');
    if (!input) {
      setGeneratingPDF(false);
      return;
    }
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();

      pdf.setTextColor(144, 12, 63);
      pdf.setFontSize(20);
      pdf.text('Student Performance Report', pdf.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

      pdf.setFontSize(14);
      pdf.text(`Name: ${student.firstName} ${student.lastName}`, 20, 30);
      pdf.text(`Email: ${student.email}`, 20, 40);

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 40;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 20, 50, pdfWidth, pdfHeight);
      pdf.save('student_report.pdf');
      setGeneratingPDF(false);
    }).catch(() => setGeneratingPDF(false));
  };

  return (
    <div id="report-content" className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-3xl font-extrabold text-green-700 mb-6 text-center">Student Performance Report</h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Chart & Table */}
        <div className="md:w-2/3 space-y-8">
          <div className="h-72 bg-gray-50 rounded-lg shadow-inner p-4 flex items-center justify-center">
            {loading ? (
              <p className="text-gray-500 text-lg font-medium">Loading chart...</p>
            ) : Object.keys(reportData).length === 0 ? (
              <p className="text-gray-400 text-lg font-medium">No data available for this student.</p>
            ) : (
              <Bar data={barChartData} options={barChartOptions} />
            )}
          </div>

          <section>
            <h3 className="text-xl font-semibold text-green-700 mb-4 border-b border-green-300 pb-2">Subject-wise Accuracy</h3>
            <div className="overflow-x-auto rounded-md shadow-sm">
              <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead className="bg-green-100 text-green-800">
                  <tr>
                    <th className="py-3 px-4 text-left border border-green-300">Subject</th>
                    <th className="py-3 px-4 text-left border border-green-300">Accuracy (%)</th>
                    <th className="py-3 px-4 text-left border border-green-300">Correct Answers</th>
                    <th className="py-3 px-4 text-left border border-green-300">Total Answers</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(reportData).map(([subject, data]) => (
                    <tr
                      key={subject}
                      className="hover:bg-green-50 border border-green-200"
                    >
                      <td className="py-2 px-4 border border-green-300">{subject}</td>
                      <td className="py-2 px-4 border border-green-300">{data.accuracy}%</td>
                      <td className="py-2 px-4 border border-green-300">{data.correct}</td>
                      <td className="py-2 px-4 border border-green-300">{data.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right: Student Selection & Info */}
        <div className="md:w-1/3 space-y-6">
          <label htmlFor="student-select" className="block text-lg font-semibold text-green-700">
            Select Student
          </label>
          <select
            id="student-select"
            className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            value={selectedStudent}
            onChange={e => setSelectedStudent(e.target.value)}
          >
            <option value="">-- Select a Student --</option>
            {students.map(({ _id, firstName, lastName }) => (
              <option key={_id} value={_id}>{firstName} {lastName}</option>
            ))}
          </select>

          {error && <p className="text-red-600 font-medium">{error}</p>}

          {student && (
            <div className="bg-green-50 rounded-md p-4 shadow-inner border border-green-200">
              <h4 className="text-lg font-semibold text-green-900 mb-2">Student Details</h4>
              <p><strong>Name:</strong> {student.firstName} {student.lastName}</p>
              <p><strong>Email:</strong> {student.email}</p>
            </div>
          )}

          <button
            onClick={downloadPDF}
            disabled={generatingPDF || !selectedStudent || Object.keys(reportData).length === 0}
            className={`w-full mt-4 py-3 rounded-md font-semibold text-white transition 
              ${generatingPDF ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
            title={generatingPDF ? 'Generating PDF...' : 'Download report as PDF'}
          >
            {generatingPDF ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
