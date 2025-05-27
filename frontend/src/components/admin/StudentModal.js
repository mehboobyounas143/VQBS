import React from 'react';

const StudentModal = ({
  selectedStudent,
  isEditing,
  onClose,
  onSave,
  onSubmitEdit,
  setSelectedStudent,
  setIsEditing,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl font-semibold mb-4">
          {isEditing ? 'Edit Student' : 'Student Details'}
        </h2>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              value={selectedStudent.firstName}
              onChange={(e) =>
                setSelectedStudent({ ...selectedStudent, firstName: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              value={selectedStudent.lastName}
              onChange={(e) =>
                setSelectedStudent({ ...selectedStudent, lastName: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              value={selectedStudent.email}
              onChange={(e) =>
                setSelectedStudent({ ...selectedStudent, email: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              value={new Date(selectedStudent.dateOfBirth).toLocaleDateString('en-CA')}
              onChange={(e) =>
                setSelectedStudent({ ...selectedStudent, dateOfBirth: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => {
                if (isEditing) {
                  onSubmitEdit();
                } else {
                  setIsEditing(true);
                }
              }}
            >
              {isEditing ? 'Save Changes' : 'Edit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;
