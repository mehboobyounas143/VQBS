import React, { useState, useEffect } from 'react';

const SubjectTable = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [subjectImage, setSubjectImage] = useState(null);
  const [editSubject, setEditSubject] = useState({ id: '', subjectName: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/subjects`);
      const data = await response.json();
      setSubjects(data.subjects);
    };

    fetchSubjects();
  }, []);

  const handleCreate = async () => {
    const formData = new FormData();
    formData.append('subjectName', newSubject);
    if (subjectImage) {
      formData.append('image', subjectImage);
    }

    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/subjects`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.subject) {
      setSubjects([...subjects, data.subject]);
      setNewSubject('');
      setSubjectImage(null);
      setModalOpen(false);
    }
  };

  const handleEdit = async () => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/subjects/${editSubject.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subjectName: editSubject.subjectName }),
    });
    const data = await response.json();
    if (data.subject) {
      const updatedSubjects = subjects.map((subject) =>
        subject._id === data.subject._id ? data.subject : subject
      );
      setSubjects(updatedSubjects);
      setModalOpen(false);
    }
  };

  const handleDelete = async (id) => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/subjects/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setSubjects(subjects.filter((subject) => subject._id !== id));
    }
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setModalOpen(true);
    setNewSubject('');
    setSubjectImage(null);
  };

  const openEditModal = (subject) => {
    setIsEditMode(true);
    setEditSubject({ id: subject._id, subjectName: subject.subjectName });
    setModalOpen(true);
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-medium mb-3">Subjects</h2>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2 text-left">Subject Name</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject._id}>
                <td className="border-t px-4 py-2">{subject.subjectName}</td>
                <td className="border-t px-4 py-2">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-500 text-sm"
                      onClick={() => openEditModal(subject)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 text-sm"
                      onClick={() => handleDelete(subject._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Subject Button */}
      <button
        onClick={openCreateModal}
        className="mt-4 px-4 py-2 bg-[#2ecc71] hover:bg-[#0b8c42] text-white rounded-md"
      >
        Add New Subject
      </button>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-medium mb-4">
              {isEditMode ? 'Edit Subject' : 'Add New Subject'}
            </h3>

            <input
              type="text"
              value={isEditMode ? editSubject.subjectName : newSubject}
              onChange={(e) => {
                if (isEditMode) {
                  setEditSubject({ ...editSubject, subjectName: e.target.value });
                } else {
                  setNewSubject(e.target.value);
                }
              }}
              className="border p-2 w-full mb-4"
              placeholder="Enter Subject Name"
            />

            {!isEditMode && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSubjectImage(e.target.files[0])}
                className="border p-2 w-full mb-4"
              />
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={isEditMode ? handleEdit : handleCreate}
                className="px-4 py-2 bg-[#2ecc71] hover:bg-[#0b8c42] text-white rounded-md"
              >
                {isEditMode ? 'Update Subject' : 'Add Subject'}
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-md"
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

export default SubjectTable;
