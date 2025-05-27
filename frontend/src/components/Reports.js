import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Reports = () => {
  const [responses, setResponses] = useState([]);
  const [reportData, setReportData] = useState({
    totalAnswers: 0,
    correctAnswers: 0,
    accuracy: 0
  });

  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [error, setError] = useState(null);

  const student = JSON.parse(localStorage.getItem('student'));
  const studentId = student ? student._id : null;

  useEffect(() => {
    if (studentId) {
      axios.get(`${process.env.REACT_APP_BACKEND_URL}api/responses/student/${studentId}`)
        .then(response => {
          setResponses(response.data.responses);
        })
        .catch(error => {
          console.error("Error fetching responses:", error);
        });
    }
  }, [studentId]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}api/subjects`)
      .then(response => setSubjects(response.data.subjects))
      .catch(() => setError('Error fetching subjects'));

    axios.get(`${process.env.REACT_APP_BACKEND_URL}api/topics`)
      .then(response => setTopics(response.data.topics))
      .catch(() => setError('Error fetching topics'));
  }, []);

  useEffect(() => {
    if (responses.length > 0) {
      const filtered = responses.filter(response => {
  if (!response.question) return false;

  const subjectMatch = selectedSubjectId ? response.question.subject === selectedSubjectId : true;
  const topicMatch = selectedTopicId ? response.question.topic === selectedTopicId : true;

  return subjectMatch && topicMatch;
});


      const correctAnswers = filtered.filter(res => res.isCorrect).length;
      const accuracy = filtered.length > 0 ? (correctAnswers / filtered.length) * 100 : 0;

      setReportData({
        totalAnswers: filtered.length,
        correctAnswers: correctAnswers,
        accuracy: accuracy.toFixed(2)
      });
    }
  }, [responses, selectedSubjectId, selectedTopicId]);

  const pieChartData = {
    labels: ['Correct Answers', 'Incorrect Answers'],
    datasets: [{
      data: [reportData.correctAnswers, reportData.totalAnswers - reportData.correctAnswers],
      backgroundColor: ['#2ecc71', '#e74c3c'],
      borderColor: '#fff',
      borderWidth: 2
    }]
  };

  const barChartData = {
    labels: ['Total Answers', 'Correct Answers'],
    datasets: [{
      label: 'Answers',
      data: [reportData.totalAnswers, reportData.correctAnswers],
      backgroundColor: ['#e67e22', '#27ae60'],
      borderColor: '#fff',
      borderWidth: 2,
      barThickness: 40
    }]
  };

  const downloadPDF = () => {
    const input = document.getElementById('report-content');
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();

      pdf.setTextColor(144, 12, 63);
      pdf.setFontSize(18);
      pdf.text('Student Performance Report', pdf.internal.pageSize.getWidth() / 2, 10, { align: 'center' });

      if (student) {
        pdf.setFontSize(12);
        const studentDetails = `Name: ${student.firstName} ${student.lastName}\nEmail: ${student.email}`;
        pdf.text(studentDetails, pdf.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
      }

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 30, pdfWidth, pdfHeight);
      pdf.save('report.pdf');
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div id="report-content" className="bg-white p-6 rounded-xl shadow-lg grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Section */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-green-600 mb-2">Performance Overview</h2>
            <p className="text-gray-600">Check your results based on selected subject and topic.</p>
          </div>
          <div className="text-lg text-gray-700 space-y-1">
            <p><strong>Total Answers:</strong> {reportData.totalAnswers}</p>
            <p><strong>Correct Answers:</strong> {reportData.correctAnswers}</p>
            <p><strong>Accuracy:</strong> {reportData.accuracy}%</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg p-4 shadow-inner">
              <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>
            <div className="bg-gray-50 rounded-lg p-4 shadow-inner">
              <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>
          </div>
        </div>

        {/* Filter and Actions Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-700">Filter by</h3>
            <div className="space-y-4 mt-4">
              <select
                className="w-full p-3 border rounded"
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                value={selectedSubjectId}
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject._id} value={subject._id}>{subject.subjectName}</option>
                ))}
              </select>

              <select
                className="w-full p-3 border rounded"
                onChange={(e) => setSelectedTopicId(e.target.value)}
                value={selectedTopicId}
              >
                <option value="">All Topics</option>
                {topics.map(topic => (
                  <option key={topic._id} value={topic._id}>{topic.topicName}</option>
                ))}
              </select>

              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={downloadPDF}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-full transition"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
