import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout.jsx';
import { authApi } from '../services/authApi.js';

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying'); // verifying | success | error

  useEffect(() => {
    let cancelled = false;

    authApi
      .verifyEmail(token)
      .then(() => {
        if (!cancelled) setStatus('success');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const copy = {
    verifying: { title: 'Verifying your email', subtitle: 'This will just take a moment.' },
    success: { title: 'Email verified', subtitle: 'You can now sign in to your account.' },
    error: { title: 'Verification failed', subtitle: 'This link is invalid or has expired.' },
  }[status];

  return (
    <AuthLayout title={copy.title} subtitle={copy.subtitle}>
      {status !== 'verifying' && (
        <Link
          to="/login"
          className="block w-full rounded-md bg-marquee-gold py-2.5 text-center font-semibold text-ink-950 hover:brightness-110"
        >
          Go to sign in
        </Link>
      )}
    </AuthLayout>
  );
}
