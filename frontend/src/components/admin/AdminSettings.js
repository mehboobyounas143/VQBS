import React from 'react';
import DifficultyLevelTable from './DifficultyLevelTable.js';
import SubjectTable from './SubjectTable';
import TopicTable from './TopicTable';

const AdminSettings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 via-white to-green-50 p-8">
      <header className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-wide">
          Admin Settings
        </h1>
        <p className="mt-2 text-gray-600 max-w-md">
          Manage subjects, topics, and difficulty levels here.
        </p>
      </header>

      <main className="max-w-7xl mx-auto flex flex-col space-y-8 md:space-y-0 md:flex-row md:space-x-8 h-[80vh]">
        {/* Sidebar / Navigation (optional, but for style) */}
        <aside className="hidden md:flex flex-col w-48 bg-white rounded-lg shadow-md p-4 sticky top-8 h-fit">
          <nav className="flex flex-col space-y-4">
            <a href="#subjects" className="text-green-700 hover:text-green-900 font-semibold">
              Subjects
            </a>
            <a href="#topics" className="text-green-700 hover:text-green-900 font-semibold">
              Topics
            </a>
            <a href="#difficulty" className="text-green-700 hover:text-green-900 font-semibold">
              Difficulty Levels
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <section className="flex-1 overflow-y-auto space-y-8">
          {/* Subjects Table */}
          <section
            id="subjects"
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold mb-4 border-b border-green-300 pb-2 text-gray-800">
              Subjects
            </h2>
            <SubjectTable />
          </section>

          {/* Topics Table */}
          <section
            id="topics"
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold mb-4 border-b border-green-300 pb-2 text-gray-800">
              Topics
            </h2>
            <TopicTable />
          </section>

          {/* Difficulty Levels Table */}
          <section
            id="difficulty"
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold mb-4 border-b border-green-300 pb-2 text-gray-800">
              Difficulty Levels
            </h2>
            <DifficultyLevelTable />
          </section>
        </section>
      </main>
    </div>
  );
};

export default AdminSettings;
