import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-zinc-900 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/favicon-light.svg" alt="Logo" className="h-8 w-8" />
          <span className="text-xl font-bold text-zinc-900 dark:text-white">Databutton</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/about" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white">
            About
          </Link>
          <Link to="/blog" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white">
            Blog
          </Link>
          <Link to="/guides" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white">
            Guides
          </Link>
          <Link to="/contact" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white">
            Contact
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Button variant="outline" size="sm">
            Sign In
          </Button>
          <Button variant="default" size="sm">
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;