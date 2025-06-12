import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import TopicsPage from './TopicsPage';
import QuestionsPage from './QuestionsPage';

const StudentSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [globalQuestionResults, setGlobalQuestionResults] = useState([]);
  const [globalTopicResults, setGlobalTopicResults] = useState([]);
  const [globalSubjectResults, setGlobalSubjectResults] = useState([]);

  const fetchSubjects = () => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}api/subjects`)
      .then(res => setSubjects(res.data.subjects || []))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject === null && selectedTopic === null && !searchTerm.trim()) {
      fetchSubjects();
      setGlobalQuestionResults([]);
      setGlobalTopicResults([]);
      setGlobalSubjectResults([]);
    }
  }, [selectedSubject, selectedTopic, searchTerm]);

  const handleSubjectClick = (id) => {
    setSelectedSubject(id);
    setSelectedTopic(null);
    setQuestions([]);
    setSearchTerm('');
    setGlobalQuestionResults([]);
    setGlobalTopicResults([]);
    setGlobalSubjectResults([]);
  };

  const handleTopicClick = (id) => {
    setSelectedTopic(id);
    axios.get(`${process.env.REACT_APP_BACKEND_URL}api/questions/topic/${id}`)
      .then(res => setQuestions(res.data.questions || []))
      .catch(() => setQuestions([]));
    setSearchTerm('');
    setGlobalQuestionResults([]);
    setGlobalTopicResults([]);
    setGlobalSubjectResults([]);
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setQuestions([]);
    setSearchTerm('');
    setGlobalQuestionResults([]);
    setGlobalTopicResults([]);
    setGlobalSubjectResults([]);
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
    setSelectedTopic(null);
    setQuestions([]);
    setSearchTerm('');
    setGlobalQuestionResults([]);
    setGlobalTopicResults([]);
    setGlobalSubjectResults([]);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);

    if (val.trim() === '') {
      setGlobalQuestionResults([]);
      setGlobalTopicResults([]);
      setGlobalSubjectResults([]);
      return;
    }

    axios.get(`${process.env.REACT_APP_BACKEND_URL}api/search`, {
      params: { keyword: val }
    })
    .then(res => {
      setGlobalQuestionResults(res.data.questions || []);
      setGlobalTopicResults(res.data.topics || []);
      setGlobalSubjectResults(res.data.subjects || []);
    })
    .catch(() => {
      setGlobalQuestionResults([]);
      setGlobalTopicResults([]);
      setGlobalSubjectResults([]);
    });
  };

  const filteredSubjects = useMemo(() => {
    if (!searchTerm.trim()) return subjects;
    return subjects.filter(subject =>
      subject.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, subjects]);

  const renderHeader = () => {
    if (!selectedSubject && !selectedTopic) {
      return (
        <>
          <h1 className="text-4xl font-extrabold text-green-700 mb-2">Virtual Question Bank System</h1>
          <p className="text-gray-600 text-lg">Explore Subjects — Choose a subject to view its topics and questions or you can search as well</p>
        </>
      );
    } else if (selectedSubject && !selectedTopic) {
      const subjectName = subjects.find(subj => subj._id === selectedSubject)?.subjectName || 'Subject';
      return (
        <>
          <button 
            onClick={handleBackToSubjects}
            className="text-green-600 hover:underline mb-1"
          >
            ← Back to Subjects
          </button>
          <h1 className="text-3xl font-bold text-green-700">{subjectName}</h1>
          <p className="text-gray-600">Select a topic to see questions</p>
        </>
      );
    } else if (selectedTopic) {
      return (
        <>
          <button 
            onClick={handleBackToTopics}
            className="text-green-600 hover:underline mb-1"
          >
            ← Back to Topics
          </button>
          <h1 className="text-3xl font-bold text-green-700">Questions</h1>
        </>
      );
    }
  };

  return (
    <div className="container mx-auto py-10 px-6 min-h-screen bg-white">
      <div className="mb-8 text-center">
        {renderHeader()}
      </div>

      {/* Search input */}
      <div className="mb-8 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search subjects, topics, or questions..."
          className="w-full px-4 py-2 border border-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Global Search Results */}
      {searchTerm.trim() !== '' && (
        <div className="space-y-12">
          {/* Subject Results */}
          {globalSubjectResults.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4 text-green-700">Subjects matching "{searchTerm}"</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {globalSubjectResults.map(subject => (
                  <div
                    key={subject._id}
                    onClick={() => handleSubjectClick(subject._id)}
                    className="cursor-pointer rounded-lg border-2 border-green-600 p-6 hover:shadow-lg hover:scale-105 transition"
                  >
                    <h3 className="text-lg font-semibold text-green-700 mb-2">{subject.subjectName}</h3>
                    <p className="text-gray-500 text-sm">Created: {new Date(subject.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Topic Results */}
          {globalTopicResults.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4 text-green-700">Topics matching "{searchTerm}"</h2>
              <div className="space-y-4">
                {globalTopicResults.map(topic => (
                  <div
                    key={topic._id}
                    onClick={() => handleTopicClick(topic._id)}
                    className="cursor-pointer border p-4 rounded hover:shadow-md transition"
                  >
                    <h3 className="text-lg font-semibold text-green-700">{topic.topicName}</h3>
                    <p className="text-gray-500 text-sm">Subject: {topic.subject?.subjectName || 'N/A'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Question Results */}
          {globalQuestionResults.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4 text-green-700">Questions matching "{searchTerm}"</h2>
              <div className="space-y-4">
                {globalQuestionResults.map(q => (
                  <div key={q._id} className="border p-4 rounded shadow-sm hover:shadow-md transition">
                    <h3 className="font-semibold text-green-700 mb-2">{q.questionText}</h3>
                    <div className="text-sm text-gray-700 mb-1"><strong>Subject:</strong> {q.subject?.subjectName || 'N/A'}</div>
                    <div className="text-sm text-gray-700 mb-1"><strong>Topic:</strong> {q.topic?.topicName || 'N/A'}</div>
                    <div className="text-sm text-gray-700"><strong>Options:</strong> {q.options.join(', ')}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {globalSubjectResults.length === 0 && globalTopicResults.length === 0 && globalQuestionResults.length === 0 && (
            <p className="text-center text-gray-500">No results found.</p>
          )}
        </div>
      )}

      {/* If no search, show default subjects */}
      {!searchTerm.trim() && !selectedSubject && !selectedTopic && (
        <>
          {filteredSubjects.length === 0 ? (
            <p className="text-center text-gray-500">No subjects found.</p>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-green-700">Subjects</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredSubjects.map(subject => (
                  <div
                    key={subject._id}
                    onClick={() => handleSubjectClick(subject._id)}
                    className="cursor-pointer rounded-lg border-2 border-green-600 p-6 hover:shadow-lg hover:scale-105 transition"
                  >
                    <h3 className="text-lg font-semibold text-green-700 mb-2">{subject.subjectName}</h3>
                    <div className="text-gray-500 text-sm mb-1">Topics: {subject.topicsCount}</div>
                    <div className="text-gray-500 text-sm mb-1">Questions: {subject.questionsCount}</div>
                    <p className="text-gray-500 text-xs">Created: {new Date(subject.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Topics page */}
      {selectedSubject && !selectedTopic && (
        <TopicsPage
          subjectId={selectedSubject}
          onTopicClick={handleTopicClick}
          onBack={handleBackToSubjects}
        />
      )}

      {/* Questions page */}
      {selectedTopic && (
        <QuestionsPage
          topicId={selectedTopic}
          subjectId={selectedSubject}
          questions={questions}
          onBack={handleBackToTopics}
        />
      )}
    </div>
  );
};

export default StudentSubjects;
