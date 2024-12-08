'use client';
import { useEffect, useState } from 'react';

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme =
      localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light');
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    const themeController = document.querySelector('.theme-controller');
    if (themeController) {
      themeController.checked = savedTheme === 'dark';
      themeController.addEventListener('change', (e) => {
        const newTheme = e.target.checked ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      });
    }
  }, []);

  return children;
}
