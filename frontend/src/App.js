// frontend/src/App.js

import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import StudentListPage from './pages/students/StudentListPage';
import StudentDetailPage from './pages/students/StudentDetailPage';
import StudentCreatePage from './pages/students/StudentCreatePage';
import StudentEditPage from './pages/students/StudentEditPage';
import ClassListPage from './pages/classes/ClassListPage';
import ClassCreatePage from './pages/classes/ClassCreatePage';
import ClassDetailPage from './pages/classes/ClassDetailPage';
import ClassEditPage from './pages/classes/ClassEditPage';

import AttendancePage from './pages/attendance/AttendancePage';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <StudentListPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/:id"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <StudentDetailPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/new"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <StudentCreatePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/:id/edit"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <StudentEditPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/classes"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ClassListPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/classes/new"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ClassCreatePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/classes/:id"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ClassDetailPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/classes/:id/edit"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ClassEditPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AttendancePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
