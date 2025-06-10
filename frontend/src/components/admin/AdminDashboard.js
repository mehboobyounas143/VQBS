import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({ students: 0, subjects: 0, questions: 0, topics: 0 });
  const [userTrends, setUserTrends] = useState({});
  const [topicTrends, setTopicTrends] = useState({});
  const [subjectStats, setSubjectStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const responses = await Promise.all([
          fetch(`${process.env.REACT_APP_BACKEND_URL}api/students`),
          fetch(`${process.env.REACT_APP_BACKEND_URL}api/subjects`),
          fetch(`${process.env.REACT_APP_BACKEND_URL}api/questions`),
          fetch(`${process.env.REACT_APP_BACKEND_URL}api/topics`),
          fetch(`${process.env.REACT_APP_BACKEND_URL}api/responses`),
          fetch(`${process.env.REACT_APP_BACKEND_URL}api/responses/subjectStats`),
        ]);

        const [
          studentsRes,
          subjectsRes,
          questionsRes,
          topicsRes,
          responsesRes,
          subjectStatsRes,
        ] = await Promise.all(
          responses.map(async (res) => {
            if (!res.ok) {
              throw new Error(`API Error: ${res.url} - ${res.statusText}`);
            }
            return res.json();
          })
        );

        setMetrics({
          students: studentsRes.students?.length || 0,
          subjects: subjectsRes.subjects?.length || 0,
          questions: questionsRes.questions?.length || 0,
          topics: topicsRes.topics?.length || 0,
        });

        const userCountsByDate = Array.isArray(responsesRes.responses)
          ? responsesRes.responses.reduce((acc, response) => {
              const date = new Date(response.submittedAt).toLocaleDateString();
              acc[date] = (acc[date] || 0) + 1;
              return acc;
            }, {})
          : {};

        const topicsByDate = topicsRes.topics?.reduce((acc, topic) => {
          const date = new Date(topic.createdAt).toLocaleDateString();
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        setUserTrends(userCountsByDate || {});
        setTopicTrends(topicsByDate || {});
        setSubjectStats(subjectStatsRes.stats || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please check your API and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const prepareChartData = (data, label, borderColor, backgroundColor) => {
    const labels = Object.keys(data).sort((a, b) => new Date(a) - new Date(b));
    const values = labels.map((label) => data[label]);

    return {
      labels: labels.length ? labels : ['No Data Available'],
      datasets: [
        {
          label,
          data: labels.length ? values : [0],
          borderColor,
          backgroundColor,
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 3,
        },
      ],
    };
  };

  const prepareSubjectStatsChartData = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return {
        labels: ['No Data Available'],
        datasets: [
          {
            label: 'No Data Available',
            data: [0],
            backgroundColor: 'rgba(200, 200, 200, 0.6)',
            borderColor: 'rgba(200, 200, 200, 1)',
            borderWidth: 1,
          },
        ],
      };
    }

    const colors = [
      'rgba(46, 204, 113, 0.7)',  // #2ecc71
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 99, 132, 0.7)',
    ];
    const borderColors = [
      'rgba(46, 204, 113, 1)',    // #2ecc71
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 99, 132, 1)',
    ];

    return {
      labels: ['Subjects'],
      datasets: data.map((item, index) => ({
        label: item.subjectName || 'Unknown',
        data: [item.studentCount],
        backgroundColor: colors[index % colors.length],
        borderColor: borderColors[index % borderColors.length],
        borderWidth: 1,
        barThickness: 40,
        borderRadius: 5,
      })),
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6 sm:p-10">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center drop-shadow-md">
        Admin Dashboard
      </h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        {Object.entries(metrics).map(([key, value]) => (
          <div
            key={key}
            className="relative bg-white rounded-2xl shadow-xl p-6 flex flex-col justify-center items-center
              hover:scale-105 transition-transform duration-300 border-2 border-green-400
              before:absolute before:-top-4 before:-left-4 before:w-12 before:h-12 before:rounded-full before:bg-gradient-to-tr before:from-green-300 before:to-green-500 before:blur-3xl"
          >
            <h2 className="capitalize text-lg font-semibold text-gray-700 tracking-wide mb-2">
              Total {key}
            </h2>
            <p className="text-4xl font-extrabold text-green-700">{value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* Additional card or info can go here */}
        <div className="flex flex-col justify-center items-center bg-white rounded-2xl shadow-xl p-6 border border-green-300 hover:shadow-2xl transition-shadow duration-300 text-center text-gray-700 font-semibold text-lg">
          <p>Welcome back, Admin! Use the sidebar to manage the system.</p>
          <p className="mt-4 text-sm text-green-600 italic">Last updated: {new Date().toLocaleString()}</p>
        </div>

                {/* Students by Subject */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-300 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-green-500 animate-pulse"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" rx="1"></rect>
              <rect x="14" y="3" width="7" height="7" rx="1"></rect>
              <rect x="14" y="14" width="7" height="7" rx="1"></rect>
              <rect x="3" y="14" width="7" height="7" rx="1"></rect>
            </svg>
            Students Taking Tests by Subject
          </h2>
          <div className="relative w-full h-64">
            <Bar
              data={prepareSubjectStatsChartData(subjectStats)}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                  legend: { position: 'right', labels: { font: { weight: 'bold' }, color: '#065f46' } },
                },
                scales: {
                  x: {
                    beginAtZero: true,
                    ticks: { color: '#065f46', font: { weight: '600' }, stepSize: 1 },
                    grid: { display: false },
                  },
                  y: {
                    ticks: { color: '#065f46', font: { weight: '600' } },
                    grid: { display: false },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* User Submissions Trend */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-300 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-green-500 animate-pulse"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12h18M12 3v18"></path>
            </svg>
            Trend of User Submissions
          </h2>
          <div className="relative w-full h-64">
            <Line
              data={prepareChartData(userTrends, 'User Submissions', '#059669', 'rgba(5, 150, 105, 0.3)')}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { labels: { color: '#047857', font: { weight: 'bold' } } },
                },
                scales: {
                  x: { ticks: { color: '#065f46', font: { weight: '600' } } },
                  y: { ticks: { color: '#065f46', font: { weight: '600' }, stepSize: 1 }, beginAtZero: true },
                },
              }}
            />
          </div>
        </div>

        {/* Topics Created Trend */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-300 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-green-500 animate-pulse"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20v-6M8 14v-4M16 14v-8"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Trend of Topics Created
          </h2>
          <div className="relative w-full h-64">
            <Bar
              data={prepareChartData(topicTrends, 'Topics Created', '#10B981', 'rgba(16, 185, 129, 0.25)')}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { labels: { color: '#059669', font: { weight: 'bold' } } },
                },
                scales: {
                  x: { ticks: { color: '#065f46', font: { weight: '600' } } },
                  y: { ticks: { color: '#065f46', font: { weight: '600' }, stepSize: 1 }, beginAtZero: true },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
