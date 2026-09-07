import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { AuthPageShell } from '../components/auth/AuthPageShell';
import { IllustrationDesk } from '../components/auth/IllustrationDesk';
import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../store/authStore';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('vasanth@talentsim.ai');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const ok = await login(email, password);
    setIsLoading(false);

    if (!ok) {
      setError('Use a valid registered email and password (minimum 6 characters).');
      return;
    }

    navigate('/dashboard');
  };

  return (
    <AuthPageShell
      leftContent={<IllustrationDesk />}
      rightContent={
        <div className="space-y-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#49545a] transition-colors hover:text-[#ff7a18]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="space-y-3 text-[#1b2023]">
            <h1 className="text-[2.1rem] font-bold tracking-[-0.06em] leading-none">Welcome back</h1>
            <p className="text-[0.95rem] text-[#49545a]">
              Continue your mock interviews and practice your next big move.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#3a4043]">
                <Mail className="h-3.5 w-3.5 text-[#1b2023]" />
                Email
              </label>
              <div className="border-b border-[#1b2023]/30 pb-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-0 bg-transparent text-[0.95rem] text-[#1b2023] placeholder:text-[#8a9398] outline-none"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#3a4043]">
                  <Lock className="h-3.5 w-3.5 text-[#1b2023]" />
                  Password
                </label>
                <button type="button" className="text-xs font-medium text-[#ff7a18] hover:text-[#e8690c]">
                  Forgot?
                </button>
              </div>
              <div className="border-b border-[#1b2023]/30 pb-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-0 bg-transparent text-[0.95rem] text-[#1b2023] placeholder:text-[#8a9398] outline-none"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center rounded-full border-0 text-base font-semibold"
              isLoading={isLoading}
              glow
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign in
            </Button>
          </form>

          <p className="text-sm text-[#4b555a]">
            Need an account?{' '}
            <Link to="/register" className="font-semibold text-[#ff7a18] hover:text-[#e8690c]">
              Create one
            </Link>
          </p>
        </div>
      }
    />
  );
};
