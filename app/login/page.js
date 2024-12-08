'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import GoogleSignIn from './GoogleSignIn';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error during login:', error);
      setError(
        error.code === 'auth/invalid-credential'
          ? 'Invalid email or password.'
          : 'An error occurred during login. Please try again.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-base-content">Welcome back</h1>
          <p className="text-base-content/70 mt-2">
            Please sign in to continue
          </p>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}

            <GoogleSignIn />

            <div className="divider text-base-content/50">
              or continue with email
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input input-bordered"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input input-bordered"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className={`btn btn-primary ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  Sign in
                </button>
              </div>
            </form>

            <p className="text-center mt-6 text-base-content/70">
              Don't have an account?{' '}
              <Link href="/signup" className="link link-primary font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
