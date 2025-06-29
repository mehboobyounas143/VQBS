import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ScoreModal from './ScoreModal';
import DifficultyModal from './DifficultyModal';

const QuestionsPage = ({
  topicId,
  subjectId,
  onBack,
  bypassDifficulty = false,
  bypassDifficultyLevel = null, // expects 'easy', 'medium', or 'hard'
}) => {
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
    if (bypassDifficulty && bypassDifficultyLevel) {
      setSelectedDifficulty(bypassDifficultyLevel.toLowerCase());
      setShowDifficultyModal(false);
    } else if (topicId && selectedDifficulty) {
      setShowDifficultyModal(false);
      fetchQuestions();
    }
  }, [topicId, selectedDifficulty, bypassDifficulty, bypassDifficultyLevel]);

  useEffect(() => {
    if (selectedDifficulty && topicId) {
      fetchQuestions();
    }
  }, [selectedDifficulty, topicId]);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const difficultyName = selectedDifficulty || 'medium';
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}api/questions/topic/${topicId}?difficulty=${difficultyName}`
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
    setResponses(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(responses).length === 0) {
      alert('Please answer at least one question.');
      return;
    }

    // Prepare responses array with evaluation
    const responsesArray = Object.keys(responses).map(questionId => {
      const response = responses[questionId];
      const question = questions.find(q => q._id === questionId);
      if (!response || !question) return null;

      let isCorrect = false;

      if (question.type === 'Descriptive') {
        // Descriptive keyword matching
        const keywords = question.keywords || [];
        const userAnswer = response.toLowerCase();

        // Count how many keywords are included in user answer
        const matchedKeywords = keywords.filter(keyword =>
          userAnswer.includes(keyword.toLowerCase())
        );

        // Threshold for correctness - at least half of the keywords must match
        const matchThreshold = Math.ceil(keywords.length / 2);
        isCorrect = matchedKeywords.length >= matchThreshold;
      } else {
        // For MCQ and TrueFalse - exact match
        isCorrect = question.correctAnswer === response;
      }

      return {
        questionId,
        answer: response,
        isCorrect,
        subjectId,
        topicId,
        difficultyLevel: question.difficultyLevel,
      };
    }).filter(Boolean);

    const calculatedScore = responsesArray.filter(r => r.isCorrect).length;
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

  const handleDifficultyModalClose = (status) => {
    if (status === 'cancelled') {
      onBack();
    } else {
      setShowDifficultyModal(false);
    }
  };

  return (
    <div className="mt-8">
      {showDifficultyModal && !bypassDifficulty && (
        <DifficultyModal
          onClose={handleDifficultyModalClose}
          onSelectDifficulty={(difficulty) => setSelectedDifficulty(difficulty.toLowerCase())}
        />
      )}
      {!showDifficultyModal && (
        <>
          {loading && <p className="text-gray-600">Loading questions...</p>}
          {error && (
            <div className="text-red-600 text-center my-4">{error}</div>
          )}
          {!loading && !error && questions.length === 0 && (
            <p className="text-gray-500 text-center">No questions available for this topic.</p>
          )}
          {!loading && questions.length > 0 && (
            <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
              {questions.map((question, index) => (
                <div key={question._id} className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">
                    {index + 1}. {question.questionText}
                  </h3>

                  {question.type === 'Descriptive' ? (
                    <textarea
                      rows={4}
                      className="w-full border border-gray-300 rounded p-2"
                      placeholder="Type your answer here..."
                      value={responses[question._id] || ''}
                      onChange={e => handleResponseChange(question._id, e.target.value)}
                    />
                  ) : (
                    <div className="space-y-2">
                      {question.options.map((option, idx) => (
                        <label key={idx} className="flex items-center">
                          <input
                            type="radio"
                            name={question._id}
                            value={option}
                            checked={responses[question._id] === option}
                            onChange={() => handleResponseChange(question._id, option)}
                            className="mr-2"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <button
                type="submit"
                className="bg-[#2ecc71] text-white py-2 px-4 rounded hover:bg-[#0b8c42] transition"
              >
                Submit
              </button>
            </form>
          )}

          {isSubmitted && (
            <>
              {/* Count all questions including descriptive */}
              <ScoreModal
                score={score}
                total={questions.length}
                onClose={() => window.location.reload()}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default QuestionsPage;
