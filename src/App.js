import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ParentDashboard from './pages/ParentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';
import CameraAttendance from './components/CameraAttendance';
import TeacherCoach from './components/TeacherCoach';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/parent" element={<ParentDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/supervisor" element={<SupervisorDashboard />} />
        <Route path="/teacher/attendance" element={<CameraAttendance />} />
        <Route path="/teacher/coach" element={<TeacherCoach />} />
      </Routes>
    </Router>
  );
}

export default App;
