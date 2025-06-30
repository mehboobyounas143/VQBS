import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ScoreModal from './ScoreModal';
import DifficultyModal from './DifficultyModal';

const QuestionsPage = ({
  topicId,
  subjectId,
  onBack,
  bypassDifficulty = false,
  bypassDifficultyLevel = null,
}) => {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [showDifficultyModal, setShowDifficultyModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showBotModal, setShowBotModal] = useState(false);
  const [botQuestion, setBotQuestion] = useState('');
  const { isAuthenticated } = useAuth();

  // Ref to the iframe element
  const iframeRef = useRef(null);
  // State to track if the bot inside the iframe is ready to receive messages
  const [isBotIframeReady, setIsBotIframeReady] = useState(false);

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

  useEffect(() => {
    // This effect runs when the modal is shown or botQuestion changes
    if (showBotModal) {
      console.log('Bot modal shown. Setting up message listener.');

      // Listener for messages from the iframe (e.g., bot ready event)
      const handleMessage = (event) => {
        // IMPORTANT: Always verify the origin in a production environment for security
        // if (event.origin !== "https://cdn.botpress.cloud") return;
        // console.log('Message from iframe:', event.data);

        // Check for the bot's ready event (Botpress often uses 'webchat:ready' or similar)
        if (event.data && event.data.type === 'webchat:ready') {
          console.log('[Botpress Iframe] Webchat inside iframe is ready!');
          setIsBotIframeReady(true);
        }
      };

      window.addEventListener('message', handleMessage);

      // Cleanup listener when modal closes or component unmounts
      return () => {
        console.log('Cleaning up message listener.');
        window.removeEventListener('message', handleMessage);
        setIsBotIframeReady(false); // Reset ready state when modal closes
      };
    }
  }, [showBotModal]); // Re-run when modal visibility changes

  useEffect(() => {
    // This effect sends the message ONLY when the bot iframe is confirmed ready
    if (showBotModal && isBotIframeReady && botQuestion && iframeRef.current) {
      console.log(`[Botpress Iframe] Sending question to bot: "${botQuestion}"`);
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'proactive-trigger',
          payload: {
            text: `Please give a hint (not the answer) for this question: "${botQuestion}"`,
          },
        },
        '*' // Target origin, consider restricting to Botpress CDN URL for security
      );
      // You might want to clear botQuestion after sending if it's a one-time message
      // setBotQuestion('');
    } else if (showBotModal && botQuestion && !isBotIframeReady) {
        console.log('[Botpress Iframe] Bot iframe not yet ready to receive question. Waiting...');
    }
  }, [showBotModal, isBotIframeReady, botQuestion]); // Depend on bot readiness

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
    setResponses(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (Object.keys(responses).length === 0) {
      alert('Please answer at least one question.');
      return;
    }

    const responsesArray = Object.keys(responses).map(questionId => {
      const response = responses[questionId];
      const question = questions.find(q => q._id === questionId);
      if (!response || !question) return null;

      let isCorrect = false;

      if (question.type === 'Descriptive') {
        const keywords = question.keywords || [];
        const userAnswer = response.toLowerCase();
        const matchedKeywords = keywords.filter(keyword =>
          userAnswer.includes(keyword.toLowerCase())
        );
        const matchThreshold = Math.ceil(keywords.length / 2);
        isCorrect = matchedKeywords.length >= matchThreshold;
      } else {
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

  const openBotWithQuestion = (questionText) => {
    setBotQuestion(questionText); // Set the question
    setIsBotIframeReady(false); // Reset ready state for new modal opening
    setShowBotModal(true);      // Open the modal
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
          {error && <div className="text-red-600 text-center my-4">{error}</div>}
          {!loading && !error && questions.length === 0 && (
            <p className="text-gray-500 text-center">No questions available for this topic.</p>
          )}
          {!loading && questions.length > 0 && (
            <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
              {questions.map((question, index) => (
                <div key={question._id} className="mb-6 border-b pb-4 relative">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">
                      {index + 1}. {question.questionText}
                    </h3>
                    <button
                      type="button"
                      onClick={() => openBotWithQuestion(question.questionText)}
                      className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm rounded shadow"
                    >
                      Ask AI Agent
                    </button>
                  </div>

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
            <ScoreModal
              score={score}
              totalQuestions={questions.length}
              onClose={() => window.location.reload()}
            />
          )}

          {/* AI Agent Modal */}
          {showBotModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-2xl rounded shadow-lg relative">
                <button
                  className="absolute top-2 right-2 text-red-600 font-bold text-xl"
                  onClick={() => setShowBotModal(false)}
                >
                  ×
                </button>
                <iframe
                  title="AI Chatbot"
                  src="https://cdn.botpress.cloud/webchat/v3.0/shareable.html?configUrl=https://files.bpcontent.cloud/2025/06/29/21/20250629212703-KIKURQOZ.json"
                  width="100%"
                  height="500px"
                  className="rounded-b"
                  allow="microphone;"
                  id="botpress-iframe"
                  ref={iframeRef} // Attach the ref here
                ></iframe>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuestionsPage;