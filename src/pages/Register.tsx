import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { AuthPageShell } from '../components/auth/AuthPageShell';
import { IllustrationDesk } from '../components/auth/IllustrationDesk';
import { UserRound, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../store/authStore';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, authError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authError) setError(authError);
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const ok = await register(name, email, password);
    setIsLoading(false);

    if (!ok) {
      setError(authError || 'Please enter your name, a valid email, and a password with at least 6 characters.');
      return;
    }

    navigate('/dashboard');
  };

  return (
    <AuthPageShell
      leftContent={<IllustrationDesk />}
      rightContent={
        <div className="space-y-6">
          <div className="space-y-3 text-[#1b2023]">
            <h1 className="text-[2.3rem] font-bold tracking-[-0.07em] leading-none">Save you account now</h1>
            <p className="text-[0.95rem] text-[#49545a] leading-relaxed">
              Get unlimited typeforms, questions and responses.
              <br />
              Free forever.
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
                <UserRound className="h-3.5 w-3.5 text-[#1b2023]" />
                Name
              </label>
              <div className="border-b border-[#1b2023]/30 pb-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-0 bg-transparent text-[0.95rem] text-[#1b2023] placeholder:text-[#8a9398] outline-none"
                  placeholder="Name or nickname"
                  required
                />
              </div>
            </div>

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
                  placeholder="Email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#3a4043]">
                <Lock className="h-3.5 w-3.5 text-[#1b2023]" />
                Password
              </label>
              <div className="border-b border-[#1b2023]/30 pb-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-0 bg-transparent text-[0.95rem] text-[#1b2023] placeholder:text-[#8a9398] outline-none"
                  placeholder="Password"
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
              Sign up
            </Button>
          </form>

          <p className="text-sm text-[#4b555a]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#ff7a18] hover:text-[#e8690c]">
              Login
            </Link>
          </p>
        </div>
      }
    />
  );
};
