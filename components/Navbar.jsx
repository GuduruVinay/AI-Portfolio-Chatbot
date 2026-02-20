import Link from 'next/link';
import ThemeToggle from './ThemeToggle'; // <-- Import the toggle

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
          AI<span className="text-blue-600 dark:text-blue-400">Agent</span>
        </Link>
        
        {/* Links & Controls Area */}
        <div className="flex items-center gap-6 font-semibold text-sm text-slate-600 dark:text-slate-300">
          <div className="flex gap-6">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Home
            </Link>
            <Link href="/games" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Games
            </Link>
          </div>
          
          {/* Vertical Divider */}
          <div className="w-px h-5 bg-slate-300 dark:bg-slate-700"></div>
          
          {/* Theme Toggle Button */}
          <ThemeToggle />
        </div>

      </div>
    </nav>
  );
}