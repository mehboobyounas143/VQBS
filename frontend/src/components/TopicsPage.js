import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TopicsPage = ({ subjectId, onTopicClick }) => {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    if (subjectId) {
      axios.get(`${process.env.REACT_APP_BACKEND_URL}api/topics/subject/${subjectId}`)
        .then(response => {
          setTopics(response.data.topics || []);
        })
        .catch(error => {
          console.error('There was an error fetching the topics!', error);
          setTopics([]); // Ensure topics is an empty array in case of error
        });
    }
  }, [subjectId]);

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold text-[#900c3f] mb-4">Topics</h2>
      <div className="space-y-4">
        {topics.length > 0 ? (
          topics.map((topic) => (
            <div
              key={topic._id}
              className="bg-[#f8e1e6] p-4 rounded-lg shadow-md cursor-pointer hover:bg-[#f7c9d1] transition-colors duration-300"
              onClick={() => onTopicClick(topic._id)}
            >
              <h3 className="text-xl font-semibold text-[#900c3f]">{topic.topicName}</h3>
              <p className="text-[#900c3f]">Number of Questions: {topic.questionCount}</p>
            </div>
          ))
        ) : (
          <p className="text-[#900c3f]">No topics available for this subject.</p>
        )}
      </div>
    </div>
  );
};

export default TopicsPage;
