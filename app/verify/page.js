'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function VerifyEmail() {
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = searchParams.get('token');
        const uid = searchParams.get('uid');

        if (!token || !uid) {
          setStatus('error');
          return;
        }

        // Get user document
        const userDoc = await getDoc(doc(db, 'users', uid));

        if (!userDoc.exists()) {
          setStatus('error');
          return;
        }

        const userData = userDoc.data();

        // Check if token matches and user is unconfirmed
        if (userData.verificationToken === token && userData.confirmed === 0) {
          // Update user document
          await updateDoc(doc(db, 'users', uid), {
            confirmed: 1,
            verificationToken: null,
            updatedAt: new Date().toISOString(),
          });

          // Send welcome email via API
          await fetch('/api/email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'welcome',
              email: userData.email,
              displayName: userData.displayName,
            }),
          });

          setStatus('success');
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Error verifying email:', error);
        setStatus('error');
      }
    };

    verifyToken();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-sm w-full">
        {status === 'verifying' && (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Verifying your email...</h1>
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-success">
              Email Verified!
            </h1>
            <p>Your email has been verified successfully.</p>
            <p className="text-sm mt-2">Redirecting to dashboard...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-error">
              Verification Failed
            </h1>
            <p>The verification link is invalid or has expired.</p>
            <button
              className="btn btn-primary mt-4"
              onClick={() => router.push('/dashboard')}
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
