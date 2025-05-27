import React, { useState, useEffect } from 'react';

const TopicTable = () => {
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTopic, setEditTopic] = useState({ id: '', topicName: '', subject: '' });
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch topics and subjects with error handling
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch subjects first
        const subjectsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/subjects`);
        if (!subjectsResponse.ok) throw new Error('Failed to fetch subjects');
        const subjectsData = await subjectsResponse.json();
        setSubjects(subjectsData.subjects);

        // Fetch topics after subjects are loaded
        const topicsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/topics`);
        if (!topicsResponse.ok) throw new Error('Failed to fetch topics');
        const topicsData = await topicsResponse.json();
        setTopics(topicsData.topics);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!selectedSubject || !newTopic) {
      alert('Please select a subject and enter a topic name');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/topics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicName: newTopic, subject: selectedSubject }),
      });
      const data = await response.json();

      if (data.topic) {
        // Ensure the subject name is included in the topic object before updating state
        const newTopicWithSubject = {
          ...data.topic,
          subject: subjects.find((subject) => subject._id === selectedSubject),
        };

        setTopics([...topics, newTopicWithSubject]);
        setNewTopic('');
        setSelectedSubject('');
        setModalOpen(false); // Close modal after creation
      }
    } catch (error) {
      alert('Error creating topic: ' + error.message);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/topics/${editTopic.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicName: editTopic.topicName,
          subject: editTopic.subject,
        }),
      });
      const data = await response.json();
      if (data.topic) {
        const updatedTopics = topics.map((topic) =>
          topic._id === data.topic._id ? data.topic : topic
        );
        setTopics(updatedTopics);
        setModalOpen(false); // Close modal after editing
      }
    } catch (error) {
      alert('Error updating topic: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/topics/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTopics(topics.filter((topic) => topic._id !== id));
      }
    } catch (error) {
      alert('Error deleting topic: ' + error.message);
    }
  };

  const openCreateModal = async () => {
  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/subjects`);
  const data = await response.json();
  setSubjects(data.subjects);

  setIsEditMode(false);
  setModalOpen(true);
  setNewTopic('');
  setSelectedSubject('');
};

const openEditModal = async (topic) => {
  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/subjects`);
  const data = await response.json();
  setSubjects(data.subjects);

  setIsEditMode(true);
  setEditTopic({
    id: topic._id,
    topicName: topic.topicName,
    subject: topic.subject._id,
  });
  setModalOpen(true);
};


  return (
    <div className="mb-6">
      <h2 className="text-xl font-medium mb-3">Topics</h2>

      {/* Table */}
      <table className="min-w-full border-collapse table-auto">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-left">Topic Name</th>
            <th className="border px-4 py-2 text-left">Subject</th>
            <th className="border px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {topics.length > 0 ? (
            topics.map((topic) => (
              <tr key={topic._id}>
                <td className="border-t px-4 py-2">{topic.topicName}</td>
                <td className="border-t px-4 py-2">
                  {topic.subject ? topic.subject.subjectName : 'No Subject'}
                </td>
                <td className="border-t px-4 py-2">
                  <button
                    className="text-blue-500"
                    onClick={() => openEditModal(topic)}
                  >
                    Edit
                  </button>
                  {' | '}
                  <button
                    className="text-red-500"
                    onClick={() => handleDelete(topic._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-4">No topics available</td>
            </tr>
          )}
        </tbody>
      </table>

      <button
        onClick={openCreateModal}
        className="mt-4 px-4 py-2 bg-[#2ecc71] hover:bg-[#0b8c42] text-white rounded-md"
      >
        Add New Topic
      </button>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-medium mb-4">
              {isEditMode ? 'Edit Topic' : 'Add New Topic'}
            </h3>
            <input
              type="text"
              value={isEditMode ? editTopic.topicName : newTopic}
              onChange={(e) => {
                if (isEditMode) {
                  setEditTopic({ ...editTopic, topicName: e.target.value });
                } else {
                  setNewTopic(e.target.value);
                }
              }}
              className="border p-2 w-full mb-4"
              placeholder="Enter Topic Name"
            />
            <select
              value={isEditMode ? editTopic.subject : selectedSubject}
              onChange={(e) => {
                if (isEditMode) {
                  setEditTopic({ ...editTopic, subject: e.target.value });
                } else {
                  setSelectedSubject(e.target.value);
                }
              }}
              className="border p-2 w-full mb-4"
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.subjectName}
                </option>
              ))}
            </select>
            <div className="flex justify-end">
              <button
                onClick={isEditMode ? handleEdit : handleCreate}
                className="px-4 py-2 bg-blue-500 text-white"
              >
                {isEditMode ? 'Update Topic' : 'Add Topic'}
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="ml-2 px-4 py-2 bg-gray-500 text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicTable;
