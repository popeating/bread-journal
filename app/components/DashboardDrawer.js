'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { useState } from 'react';
import {
  HomeIcon,
  PlusIcon,
  BookOpenIcon,
  GlobeAltIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

export default function DashboardDrawer({ children }) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div
      className={`drawer lg:drawer-open ${isCollapsed ? 'lg:drawer-mini' : ''}`}
    >
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content bg-base-100">
        <div className="flex justify-between items-center p-4 lg:hidden">
          <label htmlFor="my-drawer-2" className="btn btn-ghost drawer-button">
            <Bars3Icon className="w-5 h-5" />
          </label>
        </div>
        <div className="p-4">{children}</div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div
          className={`bg-base-100 h-full flex flex-col border-r border-base-200 ${
            isCollapsed ? 'w-16' : 'w-80'
          }`}
        >
          <div className="relative h-16 flex items-center justify-end px-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="btn btn-sm btn-ghost text-base-content absolute -right-3 top-6 bg-base-100 border border-base-200 hover:bg-base-200"
            >
              {isCollapsed ? (
                <Bars3Icon className="w-4 h-4" />
              ) : (
                <XMarkIcon className="w-4 h-4" />
              )}
            </button>
          </div>
          <ul className="menu text-base-content">
            <li>
              <Link href="/dashboard" className="flex items-center gap-2">
                <HomeIcon className="w-5 h-5" />
                {!isCollapsed && <span>Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/new-recipe"
                className="flex items-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                {!isCollapsed && <span>New Recipe</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/my-recipes"
                className="flex items-center gap-2"
              >
                <BookOpenIcon className="w-5 h-5" />
                {!isCollapsed && <span>My Recipes</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/public-recipes"
                className="flex items-center gap-2"
              >
                <GlobeAltIcon className="w-5 h-5" />
                {!isCollapsed && <span>Public Recipes</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/edit-profile"
                className="flex items-center gap-2"
              >
                <UserIcon className="w-5 h-5" />
                {!isCollapsed && <span>Edit Profile</span>}
              </Link>
            </li>
            <li className="mt-auto mb-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                {!isCollapsed && <span>Logout</span>}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
