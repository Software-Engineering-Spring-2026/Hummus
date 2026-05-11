import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import { ToastContainer } from './components/Components'

import { LandingPage } from './pages/LandingPage'
import { LoginPage, RegisterPage, ForgotPasswordPage } from './pages/Auth/AuthPages'
import { ExplorePage, MessagesPage } from './pages/Explore/ExplorePage'

import { StudentDashboard, StudentPortfolio, StudentNotifications, StudentFavorites, StudentSettings } from './pages/Student/StudentPages'
import { StudentProjects } from './pages/Student/StudentProjects'
import { StudentInternships } from './pages/Student/StudentInternships'

import { InstructorDashboard, InstructorCourses, InstructorProjects, InstructorSettings, InstructorNotifications } from './pages/Instructor/InstructorPages'

import { EmployerDashboard, EmployerInternships, EmployerApplicants, EmployerFavorites, EmployerSettings, EmployerNotifications } from './pages/Employer/EmployerPages'

import { AdminDashboard, AdminUsers, AdminCourses, AdminProjects, AdminEmployers, AdminFlags, AdminNotifications } from './pages/Admin/AdminPages'

function Protected({ children, role }) {
  const { currentUser } = useApp()
  if (!currentUser) return <Navigate to="/login" replace />
  if (role && currentUser.role !== role) return <Navigate to={`/${currentUser.role}`} replace />
  return children
}

function AppRoutes() {
  const { currentUser } = useApp()

  return (
    <>
      <Routes>
        {}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={currentUser ? <Navigate to={`/${currentUser.role}`} /> : <LoginPage />} />
        <Route path="/register" element={currentUser ? <Navigate to={`/${currentUser.role}`} /> : <RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/explore" element={<ExplorePage />} />

        {}
        <Route path="/student" element={<Protected role="student"><StudentDashboard /></Protected>} />
        <Route path="/student/portfolio" element={<Protected role="student"><StudentPortfolio /></Protected>} />
        <Route path="/student/projects" element={<Protected role="student"><StudentProjects /></Protected>} />
        <Route path="/student/internships" element={<Protected role="student"><StudentInternships /></Protected>} />
        <Route path="/student/favorites" element={<Protected role="student"><StudentFavorites /></Protected>} />
        <Route path="/student/notifications" element={<Protected role="student"><StudentNotifications /></Protected>} />
        <Route path="/student/settings" element={<Protected role="student"><StudentSettings /></Protected>} />
        <Route path="/student/messages" element={<Protected role="student"><MessagesPage role="student" /></Protected>} />

        {}
        <Route path="/instructor" element={<Protected role="instructor"><InstructorDashboard /></Protected>} />
        <Route path="/instructor/courses" element={<Protected role="instructor"><InstructorCourses /></Protected>} />
        <Route path="/instructor/projects" element={<Protected role="instructor"><InstructorProjects /></Protected>} />
        <Route path="/instructor/notifications" element={<Protected role="instructor"><InstructorNotifications /></Protected>} />
        <Route path="/instructor/settings" element={<Protected role="instructor"><InstructorSettings /></Protected>} />
        <Route path="/instructor/messages" element={<Protected role="instructor"><MessagesPage role="instructor" /></Protected>} />

        {}
        <Route path="/employer" element={<Protected role="employer"><EmployerDashboard /></Protected>} />
        <Route path="/employer/internships" element={<Protected role="employer"><EmployerInternships /></Protected>} />
        <Route path="/employer/applicants" element={<Protected role="employer"><EmployerApplicants /></Protected>} />
        <Route path="/employer/favorites" element={<Protected role="employer"><EmployerFavorites /></Protected>} />
        <Route path="/employer/notifications" element={<Protected role="employer"><EmployerNotifications /></Protected>} />
        <Route path="/employer/settings" element={<Protected role="employer"><EmployerSettings /></Protected>} />
        <Route path="/employer/messages" element={<Protected role="employer"><MessagesPage role="employer" /></Protected>} />

        {}
        <Route path="/admin" element={<Protected role="admin"><AdminDashboard /></Protected>} />
        <Route path="/admin/users" element={<Protected role="admin"><AdminUsers /></Protected>} />
        <Route path="/admin/courses" element={<Protected role="admin"><AdminCourses /></Protected>} />
        <Route path="/admin/projects" element={<Protected role="admin"><AdminProjects /></Protected>} />
        <Route path="/admin/employers" element={<Protected role="admin"><AdminEmployers /></Protected>} />
        <Route path="/admin/flags" element={<Protected role="admin"><AdminFlags /></Protected>} />
        <Route path="/admin/notifications" element={<Protected role="admin"><AdminNotifications /></Protected>} />

        {}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}
