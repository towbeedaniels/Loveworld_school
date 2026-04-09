import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ToastProvider } from './components/Toast'
import SchoolWebsite from './pages/SchoolWebsite'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Teachers from './pages/Teachers'
import Classes from './pages/Classes'
import Timetable from './pages/Timetable'
import Attendance from './pages/Attendance'
import Grades from './pages/Grades'
import Fees from './pages/Fees'
import Library from './pages/Library'
import Transport from './pages/Transport'
import Announcements from './pages/Announcements'
import HR from './pages/HR'
import Reports from './pages/Reports'
import AdvancedReports from './pages/AdvancedReports'
import Settings from './pages/Settings'
import Layout from './components/Layout'

function PrivateRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return session ? children : <Navigate to="/portal/login" />
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
          {/* Public School Website - Home */}
          <Route path="/" element={<SchoolWebsite />} />
          
          {/* Portal Authentication */}
          <Route path="/portal/login" element={<Login />} />
          <Route path="/portal/register" element={<Register />} />
          
          {/* Portal Management System - Protected */}
          <Route
            path="/portal"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="classes" element={<Classes />} />
            <Route path="timetable" element={<Timetable />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="grades" element={<Grades />} />
            <Route path="fees" element={<Fees />} />
            <Route path="library" element={<Library />} />
            <Route path="transport" element={<Transport />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="hr" element={<HR />} />
            <Route path="reports" element={<Reports />} />
            <Route path="advanced-reports" element={<AdvancedReports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
