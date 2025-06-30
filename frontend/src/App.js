import React from 'react';
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from './components/Header';
import Footer from './components/Footer';
import StudentRegister from './components/StudentRegister';
import StudentLogin from './components/StudentLogin';
import StudentHome from './components/StudentHome';
import StudentSubjects from './components/StudentSubjects';
import Profile from './components/Profile';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminPrivateRoute from './components/AdminPrivateRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminStudents from './components/admin/Students';
import AdminQuestions from './components/admin/Questions';
import AdminSettings from './components/admin/AdminSettings';
import Reports from './components/Reports';
import AdminReports from './components/admin/AdminReports';
import AdminLogin from './components/admin/AdminLogin';
import VerifyEmail from './components/VerifyEmail';
import AdminFeedback from './components/admin/AdminFeedback';
import FeedbackForm from './components/FeedbackForm';

const StudentLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow flex justify-center items-center">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminAuthProvider>
          <Routes>
            <Route path="/" element={<StudentLayout />}>
              <Route index element={<StudentHome />} />
              <Route path="subjects" element={<StudentSubjects />} />
              <Route path="register" element={<StudentRegister />} />
              <Route path="login" element={<StudentLogin />} />
              <Route
                path="profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="reports"
                element={
                  <PrivateRoute>
                    <Reports />
                  </PrivateRoute>
                }
              />
              <Route path="verify/:token" element={<VerifyEmail />} />
              <Route path="feedback" element={<FeedbackForm />} />
            </Route>

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <AdminPrivateRoute>
                  <AdminLayout>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="students" element={<AdminStudents />} />
                      <Route path="questions" element={<AdminQuestions />} />
                      <Route path="settings" element={<AdminSettings />} />
                      <Route path="reports" element={<AdminReports />} />
                      <Route path="feedbacks" element={<AdminFeedback />} />
                    </Routes>
                  </AdminLayout>
                </AdminPrivateRoute>
              }
            />
          </Routes>

          <ToastContainer />
        </AdminAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
