// routes/AppRoutes.jsx
// Defines the entire client-side routing tree.
// Protects private pages with ProtectedRoute and AdminRoute guards.

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Pages
import LoginPage          from "../pages/LoginPage";
import AdminLoginPage     from "../pages/AdminLoginPage";
import RegisterPage       from "../pages/RegisterPage";
import StudentDashboardPage from "../pages/StudentDashboardPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import ResourcesPage      from "../pages/ResourcesPage";
import ResourceDetailPage from "../pages/ResourceDetailPage";
import BookmarksPage      from "../pages/BookmarksPage";
import AIAssistantPage    from "../pages/AIAssistantPage";
import AddResourcePage    from "../pages/AddResourcePage";
import EditResourcePage   from "../pages/EditResourcePage";

// ---------------------------------------------------------------------------
// ProtectedRoute — redirects to /login if user is not authenticated.
// Shows nothing while auth state is still loading from localStorage.
// ---------------------------------------------------------------------------
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // avoid flash of redirect while restoring session

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// ---------------------------------------------------------------------------
// AdminRoute — redirects non-admins to /dashboard.
// Must be nested inside ProtectedRoute (auth is already verified).
// ---------------------------------------------------------------------------
function AdminRoute({ children }) {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// ---------------------------------------------------------------------------
// RootRedirect — the "/" route sends users to the right dashboard by role.
// ---------------------------------------------------------------------------
function RootRedirect() {
  const { isAdmin, isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />;
}

// ---------------------------------------------------------------------------
// AppRoutes — the full routing tree, wrapped in BrowserRouter
// ---------------------------------------------------------------------------
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login"       element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/register"    element={<RegisterPage />} />

        {/* Role-based root redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* Student dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Admin dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        {/* Resources list */}
        <Route
          path="/resources"
          element={
            <ProtectedRoute>
              <ResourcesPage />
            </ProtectedRoute>
          }
        />

        {/* Resource detail */}
        <Route
          path="/resources/:id"
          element={
            <ProtectedRoute>
              <ResourceDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Bookmarks */}
        <Route
          path="/bookmarks"
          element={
            <ProtectedRoute>
              <BookmarksPage />
            </ProtectedRoute>
          }
        />

        {/* AI Assistant */}
        <Route
          path="/ai"
          element={
            <ProtectedRoute>
              <AIAssistantPage />
            </ProtectedRoute>
          }
        />

        {/* Admin: Add Resource */}
        <Route
          path="/admin/add-resource"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AddResourcePage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        {/* Admin: Edit Resource */}
        <Route
          path="/admin/edit-resource/:id"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <EditResourcePage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        {/* Catch-all: redirect unknown paths to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
