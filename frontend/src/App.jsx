import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login             from './pages/Login';
import StudentDashboard  from './pages/StudentDashboard';
import StudentRoom       from './pages/StudentRoom';
import StudentComplaints from './pages/StudentComplaints';
import StudentFees       from './pages/StudentFees';
import StudentAttendance from './pages/StudentAttendance';
import AdminDashboard    from './pages/AdminDashboard';
import AdminStudents     from './pages/AdminStudents';
import AdminRooms        from './pages/AdminRooms';
import AdminComplaints   from './pages/AdminComplaints';
import AdminFees         from './pages/AdminFees';
import AdminAttendance   from './pages/AdminAttendance';

function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/student'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RootRedirect />} />

          {/* Student Routes */}
          <Route path="/student" element={
            <ProtectedRoute role="STUDENT"><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/student/room" element={
            <ProtectedRoute role="STUDENT"><StudentRoom /></ProtectedRoute>
          } />
          <Route path="/student/complaints" element={
            <ProtectedRoute role="STUDENT"><StudentComplaints /></ProtectedRoute>
          } />
          <Route path="/student/fees" element={
            <ProtectedRoute role="STUDENT"><StudentFees /></ProtectedRoute>
          } />
          <Route path="/student/attendance" element={
            <ProtectedRoute role="STUDENT"><StudentAttendance /></ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/students" element={
            <ProtectedRoute role="ADMIN"><AdminStudents /></ProtectedRoute>
          } />
          <Route path="/admin/rooms" element={
            <ProtectedRoute role="ADMIN"><AdminRooms /></ProtectedRoute>
          } />
          <Route path="/admin/complaints" element={
            <ProtectedRoute role="ADMIN"><AdminComplaints /></ProtectedRoute>
          } />
          <Route path="/admin/fees" element={
            <ProtectedRoute role="ADMIN"><AdminFees /></ProtectedRoute>
          } />
          <Route path="/admin/attendance" element={
            <ProtectedRoute role="ADMIN"><AdminAttendance /></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
