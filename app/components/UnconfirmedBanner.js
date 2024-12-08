'use client';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function UnconfirmedBanner({ userData }) {
  if (!userData || userData.confirmed !== 0) return null;

  return (
    <div className="alert alert-warning shadow-lg mb-6">
      <div className="flex items-center">
        <ExclamationTriangleIcon className="w-6 h-6 flex-shrink-0" />
        <div>
          <h3 className="font-bold">Please confirm your email address</h3>
          <div className="text-xs">
            Check your inbox for the confirmation email. If you didn't receive
            it, check your spam folder.
          </div>
        </div>
      </div>
    </div>
  );
}
