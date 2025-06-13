import React, { useState, useEffect } from 'react';
import StudentFormModal from './StudentFormModal';
import StudentTable from './StudentTable';
import StudentModal from './StudentModal';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/students`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      const data = await response.json();
      if (Array.isArray(data.students)) {
        setStudents(data.students);
      } else {
        console.error('Fetched data is not an array:', data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchStudents();
  };

  const handleShowModal = (student) => {
    setSelectedStudent(student);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
    setIsEditing(false);
  };

  const handleDelete = async (studentId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this student?');
    if (confirmDelete) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/students/${studentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        if (response.ok) {
          setStudents(students.filter((student) => student._id !== studentId));
        }
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const handleEditSubmit = async (updatedStudentData) => {
    const { _id, firstName, lastName, email, dateOfBirth } = updatedStudentData;

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/students/${_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, dateOfBirth }),
      });

      if (response.ok) {
        const updatedStudent = await response.json();
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === updatedStudent._id ? updatedStudent : student
          )
        );
        setIsEditing(false);
        setShowModal(false);
        setSelectedStudent(null);
      } else {
        console.error('Error updating student:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const handleAddStudentClick = () => {
    setShowAddModal(true);
  };

  const handleStudentAdded = (newStudentData) => {
    const newStudent = newStudentData.student || newStudentData;
    setStudents((prev) => [...prev, newStudent]);
    setShowAddModal(false);
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Students</h1>
      <div className="container mx-auto sm:w-[90%] m-auto">

        <StudentTable
          students={students}
          onShowModal={handleShowModal}
          onDelete={handleDelete}
          onAddStudent={handleAddStudentClick}
          onRefresh={handleRefresh}
          loading={loading} // ✅ Pass loading prop
        />

        {/* View/Edit Modal */}
        {showModal && (
          <StudentModal
            selectedStudent={selectedStudent}
            isEditing={isEditing}
            onClose={handleCloseModal}
            onSubmitEdit={handleEditSubmit}
            setSelectedStudent={setSelectedStudent}
          />
        )}

        {/* Add Student Modal */}
        {showAddModal && (
          <StudentFormModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onStudentAdded={handleStudentAdded}
          />
        )}
      </div>
    </>
  );
};

export default Students;
