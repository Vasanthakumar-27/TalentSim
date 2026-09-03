import { Suspense, lazy, type ReactNode } from 'react';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Loader2 } from 'lucide-react';
import { useAuth } from './store/authStore';

const Landing = lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const ResumeIntelligence = lazy(() => import('./pages/ResumeIntelligence').then(m => ({ default: m.ResumeIntelligence })));
const PracticeHub = lazy(() => import('./pages/PracticeHub').then(m => ({ default: m.PracticeHub })));
const InterviewSetup = lazy(() => import('./pages/InterviewSetup').then(m => ({ default: m.InterviewSetup })));
const InterviewLobby = lazy(() => import('./pages/InterviewLobby').then(m => ({ default: m.InterviewLobby })));
const InterviewRoom = lazy(() => import('./pages/InterviewRoom').then(m => ({ default: m.InterviewRoom })));
const InterviewReport = lazy(() => import('./pages/InterviewReport').then(m => ({ default: m.InterviewReport })));
const AICoach = lazy(() => import('./pages/AICoach').then(m => ({ default: m.AICoach })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const AdminQuestions = lazy(() => import('./pages/AdminQuestions').then(m => ({ default: m.AdminQuestions })));

const LoadingFallback = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-300 p-0.5 animate-spin">
      <div className="w-full h-full bg-[#0A0F1C] rounded-[14px] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-orange-300" />
      </div>
    </div>
    <p className="text-xs font-mono text-zinc-400 tracking-wider uppercase">Loading TalentSim...</p>
  </div>
);

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/resume" element={<ProtectedRoute><ResumeIntelligence /></ProtectedRoute>} />
            <Route path="/practice" element={<ProtectedRoute><PracticeHub /></ProtectedRoute>} />
            <Route path="/interview/setup" element={<ProtectedRoute><InterviewSetup /></ProtectedRoute>} />
            <Route path="/interview/lobby" element={<ProtectedRoute><InterviewLobby /></ProtectedRoute>} />
            <Route path="/interview/room" element={<ProtectedRoute><InterviewRoom /></ProtectedRoute>} />
            <Route path="/interview/report" element={<ProtectedRoute><InterviewReport /></ProtectedRoute>} />
            <Route path="/coach" element={<ProtectedRoute><AICoach /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/admin/questions" element={<ProtectedRoute><AdminQuestions /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

