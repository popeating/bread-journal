'use client';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { PlusIcon, BookOpenIcon, UserIcon } from '@heroicons/react/24/outline';
import UnconfirmedBanner from '../components/UnconfirmedBanner';
import LatestActiveProfiles from '../components/LatestActiveProfiles';

export default function Dashboard() {
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

  if (!user) {
    return (
      <div className="p-6 bg-base-200">
        <h1 className="text-3xl font-bold text-base-content mb-6">
          Access Denied
        </h1>
        <p className="text-base-content/70">
          Please log in to view your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {userData?.confirmed === 0 && <UnconfirmedBanner userData={userData} />}

      <h1 className="text-3xl font-bold text-base-content mb-10">
        Welcome, {userData?.displayName || user.email}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Link
          href="/dashboard/new-recipe"
          className="card bg-base-100 shadow border border-base-300 hover:shadow-lg transition-shadow"
        >
          <div className="card-body items-center text-center">
            <PlusIcon className="w-8 h-8 text-primary mb-2" />
            <h2 className="card-title text-base-content">New Recipe</h2>
            <p className="text-base-content/70">Create a new recipe</p>
          </div>
        </Link>

        <Link
          href="/dashboard/recipes"
          className="card bg-base-100 shadow border border-base-300 hover:shadow-lg transition-shadow"
        >
          <div className="card-body items-center text-center">
            <BookOpenIcon className="w-8 h-8 text-primary mb-2" />
            <h2 className="card-title text-base-content">My Recipes</h2>
            <p className="text-base-content/70">
              {userData?.recipeCount
                ? `You have ${userData.recipeCount} recipes`
                : 'Manage your recipes'}
            </p>
          </div>
        </Link>

        <Link
          href="/dashboard/edit-profile"
          className="card bg-base-100 shadow border border-base-300 hover:shadow-lg transition-shadow"
        >
          <div className="card-body items-center text-center">
            <UserIcon className="w-8 h-8 text-primary mb-2" />
            <h2 className="card-title text-base-content">Profile</h2>
            <p className="text-base-content/70">Edit your profile</p>
          </div>
        </Link>
      </div>

      <div className="card bg-base-100 shadow border border-base-200 mb-10">
        <div className="card-body">
          <h2 className="card-title mb-6">Latest Active Users</h2>
          <LatestActiveProfiles />
        </div>
      </div>
    </div>
  );
}
