'use client';

import { useState } from 'react';
import { User, Lock, Mail, UserPlus, LogIn, CheckCircle2, AlertCircle, Eye, EyeOff, Sparkles, ShieldCheck } from 'lucide-react';
import { signIn, signUp } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

function GoogleLogo({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function AuthForm({ onSuccess, isModal = false }) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        const { data, error: authError } = await signIn.email({
          email: formData.email,
          password: formData.password,
        });

        if (authError) {
          setError(authError.message || 'Invalid credentials. Please try again.');
          setIsLoading(false);
          return;
        }

        setSuccess('Welcome back to Vitasta Saree Atelier!');
        setTimeout(() => {
          if (onSuccess) onSuccess();
          if (formData.email === 'admin@vitasta.com' || window.location.pathname.includes('/admin-controls')) {
            window.location.href = '/admin-controls';
          } else {
            router.push('/account');
            router.refresh();
          }
        }, 600);
      } else {
        const { data, error: authError } = await signUp.email({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        });

        if (authError) {
          setError(authError.message || 'Registration failed. Please check your information.');
          setIsLoading(false);
          return;
        }

        setSuccess('Royal Patron membership created successfully!');
        setTimeout(() => {
          if (onSuccess) onSuccess();
          router.push('/account');
          router.refresh();
        }, 600);
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (email, password, name = '') => {
    setFormData({
      name,
      email,
      password,
      phone: '+91 88240 17443',
    });
    setIsLogin(true);
    setError(null);
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGoogleLoading(true);
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: window.location.origin + '/account',
      });
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-neutral-200 rounded-2xl shadow-xl p-6 sm:p-8 text-[#1A1A1A]">
      {/* Header */}
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#0B3B60]/10 text-[#0B3B60] border border-[#0B3B60]/20 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C1272D]" />
          Vitasta Royal Portal
        </span>
        <h2 className="text-2xl font-serif font-bold text-[#0B3B60] tracking-wide">
          {isLogin ? 'Sign In to Your Atelier' : 'Become a Royal Patron'}
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          {isLogin
            ? 'Access your bespoke orders, Loom video proof & admin tools'
            : 'Register for exclusive saree previews and concierge care'}
        </p>
      </div>

      {/* 1-Click Quick Demo Login Shortcuts */}
      <div className="mb-5 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs">
        <div className="font-semibold text-[#0B3B60] mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C1272D]" /> 1-Click Instant Demo Access
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#C1272D]">Pre-Seeded</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('admin@vitasta.com', 'password123', 'Smita Saraswat')}
            className="p-2.5 rounded-lg bg-white border border-neutral-200 text-left hover:border-[#0B3B60] hover:bg-neutral-50 transition shadow-xs group cursor-pointer"
          >
            <div className="font-bold text-[#0B3B60] flex items-center gap-1 group-hover:underline">
              👑 Atelier Admin
            </div>
            <div className="text-[11px] text-neutral-600 font-mono truncate">admin@vitasta.com</div>
            <div className="text-[10px] text-neutral-400 font-mono">password123</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('patron@vitasta.luxury', 'password123', 'Maharani Gayatri Devi')}
            className="p-2.5 rounded-lg bg-white border border-neutral-200 text-left hover:border-[#0B3B60] hover:bg-neutral-50 transition shadow-xs group cursor-pointer"
          >
            <div className="font-bold text-neutral-800 flex items-center gap-1 group-hover:underline">
              👤 Royal Patron
            </div>
            <div className="text-[11px] text-neutral-600 font-mono truncate">patron@vitasta.luxury</div>
            <div className="text-[10px] text-neutral-400 font-mono">password123</div>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading || isLoading}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 transition font-medium text-sm text-neutral-700 shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-60 mb-4"
      >
        <GoogleLogo size={18} />
        {isGoogleLoading ? 'Connecting with Google...' : 'Continue with Google'}
      </button>

      {/* Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-neutral-400 font-medium">
            or sign in manually
          </span>
        </div>
      </div>

      {/* Email / Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Maharani Gayatri Devi"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="patron@vitasta.luxury"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full pl-9 pr-10 py-2 text-sm rounded-xl border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || isGoogleLoading}
          className="w-full py-2.5 px-4 rounded-xl bg-[#0B3B60] hover:bg-[#071E3D] text-white font-medium text-sm tracking-wide shadow-md hover:shadow-lg transition active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            'Processing...'
          ) : isLogin ? (
            <>
              <LogIn className="w-4 h-4" /> Sign In to Atelier
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" /> Create Patron Account
            </>
          )}
        </button>
      </form>

      {/* Switch between Login and Register */}
      <div className="mt-4 text-center text-xs text-neutral-500">
        {isLogin ? "Don't have an Atelier account? " : 'Already a registered patron? '}
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError(null);
          }}
          className="text-[#C1272D] font-semibold underline hover:opacity-80"
        >
          {isLogin ? 'Register Here' : 'Sign In'}
        </button>
      </div>
    </div>
  );
}
