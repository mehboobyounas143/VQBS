import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DifficultyModal = ({ onClose, onSelectDifficulty }) => {
  const [difficultyLevels, setDifficultyLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}api/difficultyLevels`)
      .then((response) => {
        setDifficultyLevels(response.data.difficultyLevels || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load difficulty levels. Please try again.');
        setLoading(false);
      });
  }, []);

  const handleCancel = () => {
    onClose('cancelled'); // Optional flag to inform parent (safe, does not break existing code)
    navigate('/subjects'); // Navigate back to subjects
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Difficulty Level</h2>

        {loading && <p className="text-gray-600">Loading difficulty levels...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="space-y-4">
          {!loading && !error && difficultyLevels.map((difficulty) => (
            <button
              key={difficulty._id}
              className="w-full bg-[#2ecc71] text-white py-2 rounded hover:bg-[#0b8c42] transition-colors duration-300"
              onClick={() => onSelectDifficulty(difficulty.levelName)}
            >
              {difficulty.levelName}
            </button>
          ))}
        </div>

        <button
          className="mt-4 w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition-colors duration-300"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DifficultyModal;
