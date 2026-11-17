import React, { useState } from 'react';
import { Lock, Mail, AlertCircle, ArrowLeft, Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { loginAdmin } from '../services/adminAuthService';

interface AdminLoginProps {
  externalError?: string | null;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  externalError,
  onBackToStore
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const displayedError = errorMessage || externalError || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await loginAdmin(email, password);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to sign in. Please verify your credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col justify-between px-4 py-8">
      {/* Top Bar */}
      <div className="max-w-md w-full mx-auto">
        <button
          type="button"
          onClick={onBackToStore}
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase text-stone-600 hover:text-stone-950 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Storefront</span>
        </button>
      </div>

      {/* Login Card */}
      <div className="max-w-md w-full mx-auto my-8 bg-white rounded-2xl border border-stone-200/90 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-1.5 pb-4 border-b border-stone-100">
          <span className="font-serif text-3xl tracking-[0.24em] font-medium text-stone-900 block">
            AR SCENTS
          </span>
          <span className="text-[10px] tracking-[0.32em] text-stone-500 uppercase font-semibold block">
            AUTHORIZED ADMIN PORTAL
          </span>
        </div>

        <div className="bg-stone-50 border border-stone-200/70 rounded-xl p-3 flex items-start gap-2.5 text-[11px] text-stone-600">
          <ShieldCheck className="w-4 h-4 text-stone-800 shrink-0 mt-0.5" />
          <span>
            Restricted to authorized AR SCENTS administrators. Access is verified against the protected admin allowlist.
          </span>
        </div>

        {displayedError && (
          <div
            role="alert"
            className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-rose-800"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{displayedError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-[11px] font-bold tracking-wider uppercase text-stone-700 mb-1.5"
            >
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                disabled={isSubmitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-[11px] font-bold tracking-wider uppercase text-stone-700 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                disabled={isSubmitting}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-10 pr-10 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={isSubmitting}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5 rounded focus:outline-none cursor-pointer disabled:opacity-50"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0E0E0E] hover:bg-stone-800 disabled:bg-stone-400 text-white py-3.5 px-4 text-xs font-bold tracking-[0.18em] uppercase rounded-lg transition flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>VERIFYING ACCESS...</span>
              </>
            ) : (
              <span>SIGN IN TO ADMIN DASHBOARD</span>
            )}
          </button>
        </form>
      </div>

      {/* Footer Note */}
      <div className="text-center text-[11px] text-stone-400">
        AR SCENTS · Karachi Delivery Operations · Admin Access Only
      </div>
    </div>
  );
};
