import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import ThemeProvider from './components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Recipe App',
  description: 'A simple recipe app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <div className="sticky top-0 z-50 bg-base-100 border-b border-base-200">
              <Navbar />
            </div>
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
