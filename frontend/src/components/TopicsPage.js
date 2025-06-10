import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TopicsPage = ({ subjectId, onTopicClick, onBack }) => {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    if (subjectId) {
      axios.get(`${process.env.REACT_APP_BACKEND_URL}api/topics/subject/${subjectId}`)
        .then(res => setTopics(res.data.topics || []))
        .catch(() => setTopics([]));
    }
  }, [subjectId]);

  return (
    <div>
      <button onClick={onBack} className="text-green-600 hover:underline mb-4">
        ← Back to Subjects
      </button>

      <h2 className="text-2xl font-semibold text-green-700 mb-6">Topics</h2>

      {topics.length === 0 ? (
        <p className="text-gray-500">No topics found.</p>
      ) : (
        <ul className="space-y-3">
          {topics.map(topic => (
            <li
              key={topic._id}
              onClick={() => onTopicClick(topic._id)}
              className="cursor-pointer p-4 border border-green-600 rounded hover:bg-green-50"
            >
              {topic.topicName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopicsPage;
