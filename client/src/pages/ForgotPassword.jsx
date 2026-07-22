import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../layouts/AuthLayout.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { authApi } from '../services/authApi.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authApi.forgotPassword(email);
      // Always show success, regardless of whether the email exists —
      // this prevents account enumeration via response differences.
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="If an account exists for that address, a reset link is on its way."
      >
        <Link
          to="/login"
          className="block w-full rounded-md border border-ink-600 py-2.5 text-center font-semibold text-bone-100 hover:border-marquee-gold"
        >
          Back to sign in
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset your password" subtitle="We'll email you a link to get back in.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          id="email"
          name="email"
          label="Email address"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" isLoading={isLoading}>
          Send reset link
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-bone-400">
        Remembered it?{' '}
        <Link to="/login" className="font-medium text-marquee-gold hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
