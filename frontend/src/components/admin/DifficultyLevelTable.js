import React, { useState, useEffect } from 'react';

const DifficultyLevelTable = () => {
  const [difficultyLevels, setDifficultyLevels] = useState([]);
  const [newLevel, setNewLevel] = useState('');
  const [editLevel, setEditLevel] = useState({ id: '', levelName: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    // Fetch difficulty levels from the API
    const fetchDifficultyLevels = async () => {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/difficultyLevels`);
      const data = await response.json();
      setDifficultyLevels(data.difficultyLevels);
    };

    fetchDifficultyLevels();
  }, []);

  const handleCreate = async () => {
    // Create new difficulty level
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/difficultyLevels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ levelName: newLevel }),
    });
    const data = await response.json();
    if (data.difficultyLevel) {
      setDifficultyLevels([...difficultyLevels, data.difficultyLevel]);
      setNewLevel('');
      setModalOpen(false); // Close modal after creation
    }
  };

  const handleEdit = async () => {
    // Update existing difficulty level
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/difficultyLevels/${editLevel.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ levelName: editLevel.levelName }),
    });
    const data = await response.json();
    if (data.difficultyLevel) {
      const updatedLevels = difficultyLevels.map((level) =>
        level._id === data.difficultyLevel._id ? data.difficultyLevel : level
      );
      setDifficultyLevels(updatedLevels);
      setModalOpen(false); // Close modal after editing
    }
  };

  const handleDelete = async (id) => {
    // Delete difficulty level
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/difficultyLevels/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setDifficultyLevels(difficultyLevels.filter((level) => level._id !== id));
    }
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setModalOpen(true);
    setNewLevel('');
  };

  const openEditModal = (level) => {
    setIsEditMode(true);
    setEditLevel({ id: level._id, levelName: level.levelName });
    setModalOpen(true);
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-medium mb-3">Difficulty Levels</h2>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2 text-left">Level Name</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {difficultyLevels.map((level) => (
              <tr key={level._id} className="border-t">
                <td className="px-4 py-2">{level.levelName}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    className="text-blue-500"
                    onClick={() => openEditModal(level)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => handleDelete(level._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Level Button */}
      <button
        onClick={openCreateModal}
        className="mt-4 px-4 py-2 bg-[#2ecc71] hover:bg-[#0b8c42] text-white rounded-md"
      >
        Add New Level
      </button>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-medium mb-4">
              {isEditMode ? 'Edit Difficulty Level' : 'Add New Difficulty Level'}
            </h3>
            <input
              type="text"
              value={isEditMode ? editLevel.levelName : newLevel}
              onChange={(e) => {
                if (isEditMode) {
                  setEditLevel({ ...editLevel, levelName: e.target.value });
                } else {
                  setNewLevel(e.target.value);
                }
              }}
              className="border p-2 w-full mb-4"
              placeholder="Enter Level Name"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={isEditMode ? handleEdit : handleCreate}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                {isEditMode ? 'Update Level' : 'Add Level'}
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
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

export default DifficultyLevelTable;
