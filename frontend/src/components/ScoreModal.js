import React from 'react';

const ScoreModal = ({ score, totalQuestions }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h3 className="text-xl font-semibold text-center mb-4">Your Score</h3>
        <p className="text-lg text-center">
          You answered {score} out of {totalQuestions} questions correctly.
        </p>
        <button
          className="mt-4 bg-[#900c3f] text-white px-4 py-2 rounded block mx-auto"
          onClick={() => window.location.reload()}
        >
          Try another test
        </button>
      </div>
    </div>
  );
};

export default ScoreModal;
