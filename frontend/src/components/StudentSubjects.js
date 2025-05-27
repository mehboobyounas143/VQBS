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

  // Fetch all subjects from backend
  const fetchSubjects = () => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}api/subjects`)
      .then(res => setSubjects(res.data.subjects || []))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Reload subjects if both subject and topic are deselected
  useEffect(() => {
    if (selectedSubject === null && selectedTopic === null) fetchSubjects();
  }, [selectedSubject, selectedTopic]);

  // When a subject is clicked: select subject, reset topic & questions
  const handleSubjectClick = (id) => {
    setSelectedSubject(id);
    setSelectedTopic(null);
    setQuestions([]);
  };

  // When a topic is clicked: select topic & fetch questions
  const handleTopicClick = (id) => {
    setSelectedTopic(id);
    axios.get(`${process.env.REACT_APP_BACKEND_URL}api/questions/topic/${id}`)
      .then(res => setQuestions(res.data.questions || []))
      .catch(() => setQuestions([]));
  };

  // Back from questions page to topics page
  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setQuestions([]);
  };

  // Back from topics page to subjects list
  const handleBackToSubjects = () => {
    setSelectedSubject(null);
    setSelectedTopic(null);
    setQuestions([]);
  };

  // Filter subjects by search term (case insensitive)
  const filteredSubjects = useMemo(() => {
    if (!searchTerm.trim()) return subjects;
    return subjects.filter(subject =>
      subject.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, subjects]);

  return (
    <div className="container mx-auto py-10 px-6 min-h-screen bg-white">
      {/* Show subjects list if no subject or topic selected */}
      {!selectedTopic && selectedSubject === null && (
        <>
          <div className="mb-8 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search subjects..."
              className="w-full px-4 py-2 border border-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredSubjects.length === 0 ? (
            <p className="text-center text-gray-500">No subjects found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredSubjects.map(subject => (
                <div
                  key={subject._id}
                  onClick={() => handleSubjectClick(subject._id)}
                  className="cursor-pointer rounded-lg border-2 border-green-600 p-6
                             transform transition-transform duration-300
                             hover:scale-105 hover:shadow-lg hover:shadow-green-400/60
                             motion-reduce:transform-none
                             animate-fadeIn"
                  style={{ animationFillMode: 'forwards' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-green-700">{subject.subjectName}</h2>
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
          )}
        </>
      )}

      {/* Show topics if subject selected but no topic */}
      {selectedSubject && !selectedTopic && (
        <TopicsPage
          subjectId={selectedSubject}
          onTopicClick={handleTopicClick}
          onBack={handleBackToSubjects}  // Add back button support on TopicsPage
        />
      )}

      {/* Show questions if topic selected */}
      {selectedTopic && (
        <QuestionsPage
          topicId={selectedTopic}
          subjectId={selectedSubject}
          questions={questions}
          onBack={handleBackToTopics} // Add back button support on QuestionsPage
        />
      )}
    </div>
  );
};

export default StudentSubjects;
