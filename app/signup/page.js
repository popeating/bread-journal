'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import {
  createUserDocument,
  isDisplayNameAvailable,
} from '../firebase/database';
import { generateVerificationToken } from '../firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import GoogleSignIn from '../login/GoogleSignIn';

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    password: '',
    confirmPassword: '',
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

  const validateForm = () => {
    if (
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.displayName
    ) {
      setError('All fields are required');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password should be at least 6 characters');
      return false;
    }

    if (formData.displayName.length < 3) {
      setError('Display name should be at least 3 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Check if display name is available
      const isAvailable = await isDisplayNameAvailable(formData.displayName);
      if (!isAvailable) {
        setError('This display name is already taken');
        setLoading(false);
        return;
      }

      // Create the auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Generate verification token and link
      const verificationToken = generateVerificationToken();
      const verificationLink = `${window.location.origin}/verify?token=${verificationToken}&uid=${userCredential.user.uid}`;

      // Send verification email via API
      await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'verification',
          email: formData.email,
          displayName: formData.displayName,
          verificationLink,
        }),
      });

      // Create the user document in Firestore with verification token
      await createUserDocument({
        ...userCredential.user,
        displayName: formData.displayName,
        verificationToken,
        authMethod: 'email',
      });

      // Log verification link for development
      console.log('Verification Link:', verificationLink);

      router.push('/dashboard');
    } catch (error) {
      console.error('Error during signup:', error);
      setError(
        error.code === 'auth/email-already-in-use'
          ? 'An account with this email already exists.'
          : 'An error occurred during signup. Please try again.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-sm w-full">
        <h1 className="text-3xl font-bold text-center mb-8 text-base-content">
          Create Account
        </h1>

        <form
          onSubmit={handleSubmit}
          className="card bg-base-100 shadow border border-base-200"
        >
          <div className="card-body">
            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}

            <GoogleSignIn text="Sign up with Google" />

            <div className="divider">OR</div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Display Name</span>
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="input input-bordered"
                placeholder="Choose a display name"
                required
                minLength={3}
              />
            </div>

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

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input input-bordered"
                placeholder="Create a password"
                required
                minLength={6}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input input-bordered"
                placeholder="Confirm your password"
                required
              />
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                Sign Up
              </button>
            </div>

            <p className="text-center mt-4 text-base-content/70">
              Already have an account?{' '}
              <Link href="/login" className="link link-primary">
                Log In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
