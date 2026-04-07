import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Layout from './components/Layout'

function PrivateRoute({ children }) {
  const { session, loading } = useAuth()
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }
  
  return session ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="students" element={<div>Students Page</div>} />
            <Route path="teachers" element={<div>Teachers Page</div>} />
            <Route path="classes" element={<div>Classes Page</div>} />
            <Route path="attendance" element={<div>Attendance Page</div>} />
            <Route path="grades" element={<div>Grades Page</div>} />
            <Route path="fees" element={<div>Fees Page</div>} />
            <Route path="library" element={<div>Library Page</div>} />
            <Route path="transport" element={<div>Transport Page</div>} />
            <Route path="reports" element={<div>Reports Page</div>} />
            <Route path="settings" element={<div>Settings Page</div>} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
