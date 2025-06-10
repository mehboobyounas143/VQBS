import React from 'react';
import { useNavigate } from 'react-router-dom';

const ScoreModal = ({ score, totalQuestions }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h3 className="text-xl font-semibold text-center mb-4">Your Score</h3>
        <p className="text-lg text-center mb-6">
          You answered {score} out of {totalQuestions} questions correctly.
        </p>

        <div className="flex justify-center gap-4">
          <button
            className="bg-[#2ecc71] text-white px-4 py-2 rounded hover:bg-[#0b8c42] transition"
            onClick={() => window.location.reload()}
          >
            Try another test
          </button>

          <button
            className="bg-[#2ecc71] text-white px-4 py-2 rounded hover:bg-[#0b8c42] transition"
            onClick={() => navigate('/reports')}
          >
            Performance Overview
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScoreModal;
