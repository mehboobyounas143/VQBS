import React from 'react';
import { TrashIcon, EyeIcon, PlusIcon } from '@heroicons/react/outline';

const StudentTable = ({ students, onShowModal, onDelete, onAddStudent }) => {
  return (
    <div className="max-w-6xl bg-white">
      {/* Add Student Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={onAddStudent}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Student
        </button>
      </div>

      {/* Empty State */}
      {students.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No students found. Click "Add Student" to create a new entry.
        </div>
      )}

      {/* For small screens: Show as cards */}
      <div className="sm:hidden">
        {students.map((student) => (
          <div key={student._id} className="bg-white p-4 mb-4 border border-gray-300">
            <h3 className="text-xl font-semibold">{student.firstName} {student.lastName}</h3>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Date of Birth:</strong> {new Date(student.dateOfBirth).toLocaleDateString()}</p>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => onShowModal(student)}
                className="text-blue-500 hover:text-blue-700"
              >
                <EyeIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => onDelete(student._id)}
                className="text-red-500 hover:text-red-700"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* For larger screens: Show as table */}
      <div className="hidden sm:block">
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">First Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Last Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Date of Birth</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{student.firstName}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{student.lastName}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{student.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {new Date(student.dateOfBirth).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 space-x-4 flex items-center justify-start">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      onClick={() => onShowModal(student)}
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>

                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      onClick={() => onDelete(student._id)}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentTable;