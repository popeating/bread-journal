'use client';
import Link from 'next/link';
import {
  SunIcon,
  MoonIcon,
  BookOpenIcon,
  FireIcon,
  CakeIcon,
} from '@heroicons/react/24/outline';
import NavbarAuth from './NavbarAuth';

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 border-b border-base-200">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl text-primary">
          BreadJournal
        </Link>
        <ul className="menu menu-horizontal px-1 hidden md:flex">
          <li>
            <Link
              href="/recipes"
              className="flex items-center gap-2 text-base-content"
            >
              <BookOpenIcon className="w-5 h-5" />
              <span>Recipes</span>
            </Link>
          </li>
          <li>
            <Link
              href="/trending"
              className="flex items-center gap-2 text-base-content"
            >
              <FireIcon className="w-5 h-5" />
              <span>Trending</span>
            </Link>
          </li>
          <li>
            <Link
              href="/categories"
              className="flex items-center gap-2 text-base-content"
            >
              <CakeIcon className="w-5 h-5" />
              <span>Categories</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex-none gap-2">
        <NavbarAuth />
        <label className="swap swap-rotate btn btn-ghost btn-circle text-base-content">
          <input type="checkbox" className="theme-controller" value="dark" />
          <SunIcon className="swap-on w-5 h-5" />
          <MoonIcon className="swap-off w-5 h-5" />
        </label>
      </div>
    </div>
  );
}
