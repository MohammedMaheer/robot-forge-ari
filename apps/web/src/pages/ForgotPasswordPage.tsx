import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { apiClient } from '@/lib/api';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    try {
      await apiClient.post('/auth/forgot-password', { email: data.email });
      setSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError('root', { message });
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-brand-blue flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
            RF
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Reset Password</h1>
          <p className="text-sm text-text-secondary mt-1">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {submitted ? (
          <div className="bg-surface-elevated border border-surface-border rounded-lg p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-accent-green/20 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-text-primary">
              If an account exists with that email, you'll receive a password reset link shortly.
            </p>
            <Link
              to="/login"
              className="inline-block text-sm text-mid-blue hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="bg-surface-elevated border border-surface-border rounded-lg p-6 space-y-4">
            {errors.root && (
              <div className="bg-error/10 border border-error/30 text-error text-sm px-4 py-2 rounded">
                {errors.root.message}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Email Address</label>
              <input
                type="email"
                {...register('email')}
                className="w-full bg-surface border border-surface-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-mid-blue transition-colors"
                placeholder="you@company.com"
              />
              {errors.email && <p className="text-xs text-error mt-1">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-brand-blue text-white text-sm font-medium rounded-md hover:bg-blue-800 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </button>

            <p className="text-center text-xs text-text-secondary">
              Remembered your password?{' '}
              <Link to="/login" className="text-mid-blue hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
