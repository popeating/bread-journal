'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '../firebase/config';
import {
  UserIcon,
  Squares2X2Icon,
  UserCircleIcon,
  PencilSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';

export default function NavbarAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle clicks outside
  useEffect(() => {
    const handleClick = (e) => {
      if (isOpen && !e.target.closest('.dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  if (loading) return null;

  return user ? (
    <div className="dropdown dropdown-end">
      <button
        className="btn btn-ghost text-base-content gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {user.photoURL ? (
          <div className="avatar">
            <div className="w-6 rounded-full">
              <Image
                src={user.photoURL}
                alt="Profile"
                width={24}
                height={24}
                className="rounded-full"
              />
            </div>
          </div>
        ) : (
          <UserIcon className="w-5 h-5" />
        )}
        <span>{user.email}</span>
        {isOpen ? (
          <ChevronUpIcon className="w-4 h-4" />
        ) : (
          <ChevronDownIcon className="w-4 h-4" />
        )}
      </button>
      {isOpen && (
        <ul className="menu dropdown-content z-[1] p-2 shadow-lg bg-base-100 rounded-box w-52 mt-4 border border-base-200">
          <li>
            <Link
              href="/dashboard"
              className="text-base-content"
              onClick={handleLinkClick}
            >
              <Squares2X2Icon className="w-5 h-5" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              className="text-base-content"
              onClick={handleLinkClick}
            >
              <UserCircleIcon className="w-5 h-5" />
              View public profile
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/edit-profile"
              className="text-base-content"
              onClick={handleLinkClick}
            >
              <PencilSquareIcon className="w-5 h-5" />
              Edit profile
            </Link>
          </li>
        </ul>
      )}
    </div>
  ) : (
    <ul className="menu menu-horizontal px-1">
      <li>
        <Link href="/login" className="text-base-content">
          Login
        </Link>
      </li>
      <li>
        <Link href="/signup" className="text-base-content">
          Sign Up
        </Link>
      </li>
    </ul>
  );
}
