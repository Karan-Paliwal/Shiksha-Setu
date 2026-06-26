import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";
import DashboardLayout from "../layouts/DashboardLayout";

// ─── Lazy Loaded Pages ───────────────────────────────────
const Landing = lazy(() => import("../pages/Landing"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const AcademicsHome = lazy(() => import("../pages/academics/AcademicsHome"));
const AIHome = lazy(() => import("../pages/ai/AIHome"));
const OpportunitiesHome = lazy(() => import("../pages/opportunities/OpportunitiesHome"));
const InterviewPrepHome = lazy(() => import("../pages/interview/InterviewPrepHome"));
const SkillDevHome = lazy(() => import("../pages/skill-dev/SkillDevHome"));

const Onboarding = lazy(() => import("../pages/Onboarding"));
const ResumeBuilderHome = lazy(() => import("../pages/resume/ResumeBuilderHome"));
const ProfileHome = lazy(() => import("../pages/profile/ProfileHome"));

// ─── Protected Route Wrapper ─────────────────────────────
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user && user.isProfileComplete === false) return <Navigate to="/onboarding" replace />;

  return <>{children}</>;
};

// ─── Public Route Wrapper ────────────────────────────────
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

const OnboardingRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.isProfileComplete) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

        <Route path="/onboarding" element={<OnboardingRoute><Onboarding /></OnboardingRoute>} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="academics" element={<AcademicsHome />} />

          <Route path="ai" element={<AIHome />} />
          <Route path="opportunities" element={<OpportunitiesHome />} />
          <Route path="skill-dev" element={<SkillDevHome />} />
          <Route path="interview-prep" element={<InterviewPrepHome />} />
          <Route path="resume-builder" element={<ResumeBuilderHome />} />
          <Route path="profile" element={<ProfileHome />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
