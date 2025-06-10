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

  // Fetch all subjects from backend
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
    }
  }, [selectedSubject, selectedTopic, searchTerm]);

  // Handlers for clicks on subject/topic (clear search)
  const handleSubjectClick = (id) => {
    setSelectedSubject(id);
    setSelectedTopic(null);
    setQuestions([]);
    setSearchTerm('');
    setGlobalQuestionResults([]);
  };

  const handleTopicClick = (id) => {
    setSelectedTopic(id);
    axios.get(`${process.env.REACT_APP_BACKEND_URL}api/questions/topic/${id}`)
      .then(res => setQuestions(res.data.questions || []))
      .catch(() => setQuestions([]));
    setSearchTerm('');
    setGlobalQuestionResults([]);
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setQuestions([]);
    setSearchTerm('');
    setGlobalQuestionResults([]);
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
    setSelectedTopic(null);
    setQuestions([]);
    setSearchTerm('');
    setGlobalQuestionResults([]);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);

    if (val.trim() === '') {
      // Clear search results if input empty
      setGlobalQuestionResults([]);
      return;
    }

    // Call backend to search questions matching keyword
    axios.get(`${process.env.REACT_APP_BACKEND_URL}api/questions/search`, {
      params: { keyword: val }
    })
    .then(res => {
      setGlobalQuestionResults(res.data.questions || []);
    })
    .catch(() => {
      setGlobalQuestionResults([]);
    });
  };

  // Filter subjects locally based on searchTerm
  const filteredSubjects = useMemo(() => {
    if (!searchTerm.trim()) return subjects;
    return subjects.filter(subject =>
      subject.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, subjects]);

  // Header rendering
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
          placeholder="Search subjects or questions..."
          className="w-full px-4 py-2 border border-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* If no subject or topic selected, show filtered subjects and question results (if any) */}
      {!selectedSubject && !selectedTopic && (
        <>
          {/* Subjects */}
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
                    className="cursor-pointer rounded-lg border-2 border-green-600 p-6
                               transform transition-transform duration-300
                               hover:scale-105 hover:shadow-lg hover:shadow-green-400/60
                               motion-reduce:transform-none
                               animate-fadeIn mb-6"
                    style={{ animationFillMode: 'forwards' }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-green-700">{subject.subjectName}</h3>
                      {subject.icon && (
                        <img
                          src={`${process.env.REACT_APP_BACKEND_URL}uploads/${subject.icon}`}
                          alt={`${subject.subjectName} icon`}
                          className="w-10 h-10 object-contain"
                        />
                      )}
                    </div>
                    <div className="flex justify-between text-green-700 font-medium mb-2">
                      <span>Topics: {subject.topicsCount}</span>
                      <span>Questions: {subject.questionsCount}</span>
                    </div>
                    <p className="text-gray-500 text-xs">
                      Created: {new Date(subject.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Questions */}
          {searchTerm.trim() !== '' && (
            <div className="mt-10 max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4 text-green-700">Questions matching "{searchTerm}"</h2>
              {globalQuestionResults.length === 0 ? (
                <p className="text-center text-gray-500">No questions found.</p>
              ) : (
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
              )}
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
