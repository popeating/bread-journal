'use client';
import { useState } from 'react';
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function UnconfirmedAlert() {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="alert alert-warning shadow-lg mb-6">
      <div className="flex-1">
        <ExclamationTriangleIcon className="w-6 h-6" />
        <div>
          <h3 className="font-bold">Please confirm your email address</h3>
          <div className="text-xs">
            Check your inbox for the confirmation email. If you didn't receive
            it, check your spam folder.
          </div>
        </div>
      </div>
      <div className="flex-none">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setIsDismissed(true)}
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
