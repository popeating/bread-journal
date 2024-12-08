'use client';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async (user) => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        await fetchUserData(user);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-base-200">
        <div className="animate-pulse">
          <div className="h-8 bg-base-300 rounded w-1/4 mb-6"></div>
          <div className="h-32 bg-base-300 rounded mb-6"></div>
        </div>
      </div>
    );
  }

  if (!user || !userData) {
    return (
      <div className="p-6 bg-base-200">
        <h1 className="text-3xl font-bold text-base-content mb-6">
          Profile Not Found
        </h1>
        <p className="text-base-content/70">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-base-200">
      <h1 className="text-3xl font-bold text-base-content mb-6">
        {userData.displayName
          ? `${userData.displayName}'s Profile`
          : 'Public Profile'}
      </h1>

      <div className="card bg-base-100 shadow border border-base-300">
        <div className="card-body">
          <div className="flex items-start gap-6">
            <div className="avatar">
              {userData.photoURL ? (
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={userData.photoURL}
                    alt="Profile"
                    className="rounded-full w-24 h-24"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="w-24 rounded-full bg-base-300 flex items-center justify-center">
                  <UserCircleIcon className="w-16 h-16 text-base-content/70" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-base-content mb-1">
                  {userData.displayName || 'Anonymous User'}
                </h2>
                {userData.description && (
                  <p className="text-base-content/70 whitespace-pre-line">
                    {userData.description}
                  </p>
                )}
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium text-base-content/70">
                    Email
                  </label>
                  <p className="text-base-content mt-1">{userData.email}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-base-content/70">
                    Member Since
                  </label>
                  <p className="text-base-content mt-1">
                    {userData.createdAt
                      ? new Date(userData.createdAt).toLocaleDateString()
                      : 'Not available'}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-base-content/70">
                    Last Active
                  </label>
                  <p className="text-base-content mt-1">
                    {userData.lastActive
                      ? new Date(userData.lastActive).toLocaleDateString()
                      : 'Not available'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body">
            <h2 className="card-title text-base-content">
              Recipes ({userData.recipeCount || 0})
            </h2>
            <p className="text-base-content/70">
              {userData.recipeCount
                ? 'View all recipes'
                : 'No recipes published yet.'}
            </p>
          </div>
        </div>

        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body">
            <h2 className="card-title text-base-content">
              Public Recipes ({userData.publicRecipes || 0})
            </h2>
            <p className="text-base-content/70">
              {userData.publicRecipes
                ? 'View public recipes'
                : 'No public recipes yet.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
