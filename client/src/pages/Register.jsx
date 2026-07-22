import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../layouts/AuthLayout.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created — check your email to verify it.');
      navigate('/login');
    } catch (err) {
      const details = err.response?.data?.details;
      if (Array.isArray(details)) {
        const fieldErrors = {};
        details.forEach((d) => {
          const field = d.path.replace('body.', '');
          fieldErrors[field] = d.message;
        });
        setErrors(fieldErrors);
      }
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Unlimited movies, TV shows, and more.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          id="name"
          name="name"
          label="Full name"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          required
        />
        <Input
          id="email"
          name="email"
          label="Email address"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
        <Input
          id="password"
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          required
        />
        <Button type="submit" isLoading={isLoading}>
          Sign up
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-bone-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-marquee-gold hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
