import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTimes } from 'react-icons/fa';

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

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const subjectsRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/subjects`);
        setSubjects(subjectsRes.data.subjects || []);

        const difficultyLevelsRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/difficultyLevels`);
        setDifficultyLevels(difficultyLevelsRes.data.difficultyLevels || []);
      } catch (error) {
        console.error('Error fetching options:', error);
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
    }
  }, [questionData]);

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

    const questionDataToUpdate = {
      questionText,
      type,
      subject,
      topic,
      difficultyLevel,
      ...(type !== 'Descriptive' && { options, correctAnswer }),
    };

    try {
      let response;

      if (questionData && questionData._id) {
        response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}api/questions/${questionData._id}`, questionDataToUpdate);
        toast.success('Question updated successfully!');
      } else {
        response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}api/questions`, questionDataToUpdate);
        toast.success('Question created successfully!');
      }

      if (fetchQuestions) fetchQuestions();
      closeModal();
    } catch (error) {
      console.error('Error saving question:', error);
      toast.error('Error saving question!');
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
            <FaTimes size={24} />
          </button>
        </header>

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
                  <div key={index} className="flex flex-wrap gap-2 items-center">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="w-full sm:w-3/4 p-2 mt-1 border border-gray-300 rounded-md"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700 mt-2"
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

          <div className="mb-4">
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
            className="w-full py-2 px-4 bg-[#2ecc71] text-white font-semibold rounded-md hover:bg-[#0b8c42]"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuestionModal;
