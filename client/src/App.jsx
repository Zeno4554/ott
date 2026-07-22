import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import PublicOnlyRoute from './routes/PublicOnlyRoute.jsx';
import { useAuth } from './hooks/useAuth.js';

// Temporary landing stub — replaced by the real homepage in Sprint 4.
function Home() {
  const { user, logout } = useAuth();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-950 text-bone-100">
      <h1 className="font-display text-3xl tracking-marquee text-marquee-gold">
        Welcome, {user?.name}
      </h1>
      <button
        onClick={logout}
        className="rounded-md border border-ink-600 px-4 py-2 text-sm hover:border-marquee-gold"
      >
        Sign out
      </button>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      <Route path="/verify-email/:token" element={<VerifyEmail />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}
