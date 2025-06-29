import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuestionModal = ({ questionData, closeModal, fetchQuestions }) => {
  const [questionText, setQuestionText] = useState('');
  const [type, setType] = useState('MCQ');
  const [options, setOptions] = useState(['']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [difficultyLevels, setDifficultyLevels] = useState([]);
  const [keywords, setKeywords] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const subjectsRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/subjects`);
        setSubjects(subjectsRes.data.subjects || []);

        const difficultyLevelsRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/difficultyLevels`);
        setDifficultyLevels(difficultyLevelsRes.data.difficultyLevels || []);
      } catch (error) {
        console.error('Error fetching options:', error);
        setMessage({ text: 'Error fetching subjects or difficulty levels.', type: 'error' });
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchTopics = async () => {
      if (subject) {
        try {
          const topicsRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/topics/subject/${subject}`);
          setTopics(topicsRes.data.topics || []);
        } catch (error) {
          console.error('Error fetching topics:', error);
          setMessage({ text: 'Error fetching topics.', type: 'error' });
        }
      } else {
        setTopics([]);
      }
    };

    fetchTopics();
  }, [subject]);

  useEffect(() => {
    if (questionData) {
      setQuestionText(questionData.questionText);
      setType(questionData.type);
      setOptions(questionData.options || ['']);
      setCorrectAnswer(questionData.correctAnswer || '');
      setSubject(questionData.subject._id);
      setTopic(questionData.topic._id);
      setDifficultyLevel(questionData.difficultyLevel._id);
      setKeywords(questionData.keywords ? questionData.keywords.join(', ') : '');
    }
  }, [questionData]);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsedKeywords = type === 'Descriptive' && keywords
      ? keywords.split(',').map(k => k.trim()).filter(k => k)
      : [];

    const questionDataToUpdate = {
      questionText,
      type,
      subject,
      topic,
      difficultyLevel,
      ...(type !== 'Descriptive' && { options, correctAnswer }),
      ...(type === 'Descriptive' && { keywords: parsedKeywords }),
    };

    try {
      if (questionData && questionData._id) {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}api/questions/${questionData._id}`, questionDataToUpdate);
        setMessage({ text: 'Question updated successfully!', type: 'success' });
      } else {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}api/questions`, questionDataToUpdate);
        setMessage({ text: 'Question created successfully!', type: 'success' });
      }

      if (fetchQuestions) fetchQuestions();
      closeModal();
    } catch (error) {
      console.error('Error saving question:', error);
      setMessage({ text: 'Error saving question.', type: 'error' });
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full overflow-y-auto max-h-[90vh]">
        <header className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{questionData ? 'Edit Question' : 'Create New Question'}</h2>
          <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        {message.text && (
          <div className={`p-3 mb-4 rounded-md text-white ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="questionText" className="block text-lg font-semibold text-gray-700">Question Text</label>
            <input
              type="text"
              id="questionText"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="type" className="block text-lg font-semibold text-gray-700">Type</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            >
              <option value="MCQ">MCQ</option>
              <option value="TrueFalse">True/False</option>
              <option value="Descriptive">Descriptive</option>
            </select>
          </div>

          {type !== 'Descriptive' && (
            <>
              <div className="mb-4">
                <label className="block text-lg font-semibold text-gray-700">Options</label>
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="flex-grow p-2 border border-gray-300 rounded-md"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 mt-2"
                >
                  Add Option
                </button>
              </div>

              <div className="mb-4">
                <label htmlFor="correctAnswer" className="block text-lg font-semibold text-gray-700">Correct Answer</label>
                <select
                  id="correctAnswer"
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Correct Answer</option>
                  {options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {type === 'Descriptive' && (
            <div className="mb-4">
              <label className="block text-lg font-semibold text-gray-700">Keywords</label>
              <div className="flex flex-wrap gap-2 border border-gray-300 p-2 rounded-md min-h-[48px]">
                {keywords.split(',').map((kw, index) => {
                  const trimmed = kw.trim();
                  if (!trimmed) return null;
                  return (
                    <span
                      key={index}
                      className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {trimmed}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = keywords
                            .split(',')
                            .map(k => k.trim())
                            .filter((_, i) => i !== index)
                            .join(', ');
                          setKeywords(updated);
                        }}
                        className="ml-2 text-red-500 hover:text-red-700 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
                <input
                  type="text"
                  placeholder="Type a keyword and press Enter"
                  className="flex-grow outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      const newKeyword = e.target.value.trim();
                      if (newKeyword && !keywords.split(',').map(k => k.trim()).includes(newKeyword)) {
                        const newKeywords = keywords ? `${keywords}, ${newKeyword}` : newKeyword;
                        setKeywords(newKeywords);
                      }
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="subject" className="block text-lg font-semibold text-gray-700">Subject</label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.subjectName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="topic" className="block text-lg font-semibold text-gray-700">Topic</label>
            <select
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Topic</option>
              {topics.map((topic) => (
                <option key={topic._id} value={topic._id}>
                  {topic.topicName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="difficultyLevel" className="block text-lg font-semibold text-gray-700">Difficulty Level</label>
            <select
              id="difficultyLevel"
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Difficulty Level</option>
              {difficultyLevels.map((level) => (
                <option key={level._id} value={level._id}>
                  {level.levelName}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#2ecc71] text-white font-semibold rounded-md hover:bg-#0b8c42"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuestionModal;
