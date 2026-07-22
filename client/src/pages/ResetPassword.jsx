import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../layouts/AuthLayout.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { authApi } from '../services/authApi.js';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPassword(token, form.password);
      toast.success('Password reset — please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'This link is invalid or has expired');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Set a new password" subtitle="Choose something you haven't used before.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          id="password"
          name="password"
          label="New password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <Input
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={error}
          required
        />
        <Button type="submit" isLoading={isLoading}>
          Reset password
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-bone-400">
        <Link to="/login" className="font-medium text-marquee-gold hover:underline">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
