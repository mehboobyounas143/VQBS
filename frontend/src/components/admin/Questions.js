import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuestionModal from './QuestionModal';  // Import the modal component

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [loading, setLoading] = useState(true);  // For loading state
  const [error, setError] = useState(null);  // For error state

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);  // Start loading
        const questionsRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/questions`);
        setQuestions(questionsRes.data.questions);
      } catch (error) {
        setError('Error fetching questions');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);  // Stop loading
      }
    };

    fetchData();
  }, []);

  const handleEdit = (question) => {
    setSelectedQuestion(question); // Set the selected question to edit
    setIsModalOpen(true); // Open the modal
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}api/questions/${id}`);
      setQuestions(questions.filter((question) => question._id !== id));
    } catch (error) {
      setError('Error deleting question');
      console.error('Error deleting question:', error);
    }
  };

  const handleCreateNew = () => {
    setSelectedQuestion(null);  // Clear selected question for creating a new one
    setIsModalOpen(true);  // Open modal for creating a new question
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Questions</h2>
      <div className="max-w-6xl bg-white sm:w-[90%] m-auto">
        <button
          onClick={handleCreateNew}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700 mb-4"
        >
          Create New Question
        </button>

        {/* Responsive design: For mobile devices, show as cards */}
        <div className="sm:hidden">
          {questions.map((question) => (
            <div key={question._id} className="bg-white shadow-md p-4 mb-4 rounded-lg border border-gray-300">
              <h3 className="text-xl font-semibold">{question.questionText}</h3>
              <p><strong>Answer:</strong> {question.correctAnswer}</p>
              <p><strong>Type:</strong> {question.type}</p>
              <p><strong>Subject:</strong> {question.subject.subjectName}</p>
              <p><strong>Topic:</strong> {question.topic.topicName}</p>
              <div className="mt-4">
                <button
                  onClick={() => handleEdit(question)}
                  className="text-blue-500 hover:text-blue-700 mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(question._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* For larger screens, show as table */}
        <div className="hidden sm:block">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="px-6 py-4 text-gray-700 font-semibold">Question Text</th>
                  <th className="px-6 py-4 text-gray-700 font-semibold">Answer</th>
                  <th className="px-6 py-4 text-gray-700 font-semibold">Type</th>
                  <th className="px-6 py-4 text-gray-700 font-semibold">Subject</th>
                  <th className="px-6 py-4 text-gray-700 font-semibold">Topic</th>
                  <th className="px-6 py-4 text-gray-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question) => (
                  <tr key={question._id} className="border-b border-gray-200">
                    <td className="px-6 py-4 text-gray-800">{question.questionText}</td>
                    <td className="px-6 py-4 text-gray-800">{question.correctAnswer}</td>
                    <td className="px-6 py-4 text-gray-800">{question.type}</td>
                    <td className="px-6 py-4 text-gray-800">{question.subject.subjectName}</td>
                    <td className="px-6 py-4 text-gray-800">{question.topic.topicName}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEdit(question)} // Set the question to edit
                        className="text-blue-500 hover:text-blue-700 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(question._id)} // Delete question
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Only show modal if isModalOpen is true and there is a selected question */}
      {isModalOpen && (
        <QuestionModal
          questionData={selectedQuestion} // Pass the selected question as prop
          closeModal={() => setIsModalOpen(false)} // Pass closeModal function
          fetchQuestions={() => {
            // Re-fetch questions after modal close
            const fetchData = async () => {
              try {
                const questionsRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/questions`);
                setQuestions(questionsRes.data.questions);
              } catch (error) {
                console.error('Error fetching data:', error);
              }
            };
            fetchData();
          }} // Pass fetchQuestions to the modal
        />
      )}
    </>
  );
};

export default Questions;
