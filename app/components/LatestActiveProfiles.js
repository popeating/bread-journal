'use client';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function LatestActiveProfiles() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const currentUser = auth.currentUser;
        const usersRef = collection(db, 'users');

        const q = query(usersRef, orderBy('lastActive', 'desc'), limit(8));

        const querySnapshot = await getDocs(q);
        const activeUsers = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((user) => user.displayName !== currentUser?.displayName);

        setUsers(activeUsers);
      } catch (error) {
        console.error('Error fetching active users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveUsers();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 bg-base-300 rounded-full mb-2"></div>
            <div className="h-4 bg-base-300 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return <p className="text-base-content/70">No active users found.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {users.map((user) => (
        <Link
          key={user.id}
          href={`/profile/${encodeURIComponent(user.displayName)}`}
          className="flex flex-col items-center group"
        >
          <div className="avatar mb-2">
            {user.photoURL ? (
              <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 group-hover:ring-secondary transition-all">
                <img
                  src={user.photoURL}
                  alt={`${user.displayName}'s avatar`}
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 group-hover:ring-secondary transition-all bg-base-300">
                <div className="w-full h-full flex items-center justify-center">
                  <UserCircleIcon className="w-12 h-12 text-base-content/70" />
                </div>
              </div>
            )}
          </div>
          <span className="text-base-content font-medium text-center group-hover:text-primary transition-colors">
            {user.displayName}
          </span>
        </Link>
      ))}
    </div>
  );
}
