import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ScoreModal from './ScoreModal';
import DifficultyModal from './DifficultyModal';

const QuestionsPage = ({ topicId, subjectId }) => {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [showDifficultyModal, setShowDifficultyModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (topicId && selectedDifficulty) {
      setShowDifficultyModal(false);
      fetchQuestions();
    }
  }, [topicId, selectedDifficulty]);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}api/questions/topic/${topicId}?difficulty=${selectedDifficulty}`
      );
      setQuestions(response.data.questions || []);
    } catch (err) {
      setError('No questions found.');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResponseChange = (questionId, answer) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    const responsesArray = Object.keys(responses)
      .map((questionId) => {
        const response = responses[questionId];
        const question = questions.find((q) => q._id === questionId);

        if (!response || !question) return null;

        return {
          questionId,
          answer: response,
          isCorrect: question.correctAnswer === response,
          subjectId,
          topicId,
          difficultyLevel: question.difficultyLevel,
        };
      })
      .filter((response) => response !== null);

    const calculatedScore = responsesArray.filter((response) => response.isCorrect).length;
    setScore(calculatedScore);

    if (responsesArray.length > 0 && isAuthenticated) {
      const student = JSON.parse(localStorage.getItem('student'));
      if (student && student._id) {
        try {
          await axios.post(`${process.env.REACT_APP_BACKEND_URL}api/responses`, {
            responses: responsesArray,
            studentId: student._id,
            subjectId,
            topicId,
          });
        } catch (err) {
          console.error('Error saving responses:', err);
        }
      }
    }
    setIsSubmitted(true);
  };

  return (
    <div className="mt-8">
      {showDifficultyModal && (
        <DifficultyModal
          onClose={() => setShowDifficultyModal(false)}
          onSelectDifficulty={(difficulty) => setSelectedDifficulty(difficulty)}
        />
      )}
      {!showDifficultyModal && (
        <>
          {loading && <p className="text-gray-600">Loading questions...</p>}
          {error && (
            <div className="flex items-center justify-center">
              <p className="text-red-600 border border-red-500 p-4 rounded-md">
                {error}
              </p>
            </div>
          )}
          {!loading && !error && questions.length === 0 && (
            <p className="text-[#2ecc71]">No questions available for this topic.</p>
          )}
          {!loading && !error && questions.length > 0 && (
            <>
              <h2 className="text-3xl font-bold text-[#2ecc71] mb-4">Questions</h2>
              {questions.map((question) => (
                <div key={question._id} className="bg-white p-4 rounded-lg shadow-md mb-4">
                  <h3 className="text-lg font-semibold text-[#2ecc71]">{question.questionText}</h3>
                  <ul className="list-disc ml-5 mt-2">
                    {question.options.map((option, index) => (
                      <li key={index} className="mt-1">
                        <label className="text-[#2ecc71]">
                          <input
                            type="radio"
                            name={`question-${question._id}`}
                            value={option}
                            onChange={() => handleResponseChange(question._id, option)}
                            disabled={isSubmitted}
                          />{' '}
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {!isSubmitted && (
                <button
                  className="mt-4 bg-[#2ecc71] text-white px-4 py-2 rounded hover:bg-[#a51d47] transition-colors duration-300"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              )}
              {isSubmitted && <ScoreModal score={score} totalQuestions={questions.length} />}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default QuestionsPage;
