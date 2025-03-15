import React from 'react';
import { cn } from '@/utils/cn';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Logo and Copyright */}
        <div className="mb-4 md:mb-0">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/favicon-light.svg" alt="Logo" className="h-8 w-8" />
            <span className="text-xl font-bold">Databutton</span>
          </Link>
          <p className="mt-2 text-sm">© 2023 Databutton. All rights reserved.</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex space-x-6">
          <Link to="/about" className="hover:text-zinc-900 dark:hover:text-white">
            About
          </Link>
          <Link to="/blog" className="hover:text-zinc-900 dark:hover:text-white">
            Blog
          </Link>
          <Link to="/guides" className="hover:text-zinc-900 dark:hover:text-white">
            Guides
          </Link>
          <Link to="/contact" className="hover:text-zinc-900 dark:hover:text-white">
            Contact
          </Link>
          <Link to="/terms" className="hover:text-zinc-900 dark:hover:text-white">
            Terms
          </Link>
        </nav>

        {/* Social Media Links */}
        <div className="flex space-x-4">
          <a href="https://twitter.com/databutton" target="_blank" rel="noopener noreferrer">
            <svg
              className="h-6 w-6 hover:text-zinc-900 dark:hover:text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8.29 20.25c7.2 0 11.25-5.93 11.25-11.25 0-.16 0-.33-.01-.5H12.28c-.01.46-.06.9-.16 1.32v.09c0 3.41-2.57 6.17-5.96 6.17-1.16 0-2.22-.15-3.17-.42a6.2 6.2 0 011.63-3.11 3.07 3.07 0 00.09-.65 3.1 3.1 0 00-.94-2.18 8.5 8.5 0 017.25-4.49c-.81.33-1.7.56-2.63.65a3.07 3.07 0 00-2.29-.95 3.1 3.1 0 00-.94 2.18c0 1.49.75 2.81 1.91 3.56-.71 0-1.32-.21-1.85-.55a3.1 3.1 0 00-.94 2.18C6.59 16.77 4.77 18.59 2.8 19.44a9.63 9.63 0 01-1.89-.34 3.1 3.1 0 00-.94 2.18 3.07 3.07 0 00.09.65c0 5.32 4.05 9.6 9.36 9.6 5.88 0 10.5-4.62 10.5-10.5 0-.17 0-.33-.01-.5H8.28c-.01.46-.06.9-.16 1.32z" />
            </svg>
          </a>
          <a href="https://facebook.com/databutton" target="_blank" rel="noopener noreferrer">
            <svg
              className="h-6 w-6 hover:text-zinc-900 dark:hover:text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.479h3.047V9.358c0-3.007 1.792-4.669 4.533-4.669 1.326 0 2.504.103 2.504.103v3.062h-1.517c-1.474 0-1.886.667-1.886 1.816v2.231h3.362l-.486 3.479h-2.876v8.385C13.617 22.027 18.99 17.062 18.99 12.073z" />
            </svg>
          </a>
          <a href="https://linkedin.com/company/databutton" target="_blank" rel="noopener noreferrer">
            <svg
              className="h-6 w-6 hover:text-zinc-900 dark:hover:text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-8h3v8zm-1.5-8.264c-.962-.962-2.58-.962-3.544 0s-.962 2.578 0 3.542c.962.963 2.58.963 3.544 0s.962-2.579 0-3.542zm13.5 8.264h-3v-6.637c0-2.022-.667-3.386-2.54-3.386-.873 0-1.866.583-2.36 1.453v-1.414c0-.962-.77-1.735-1.732-1.735-1.062 0-1.934.773-1.934 1.735v6.637h-3v-8h3v1c.487-.656 1.262-1.028 2.122-1.028 1.202 0 2.158.956 2.158 2.16v6.637h-3v-8.003c0-1.496-.535-2.565-1.588-3.127-.583-.343-1.29-.519-2.097-.519-.895 0-1.602.176-2.188.519-.953.562-1.588 1.626-1.588 3.127v8.003h-3v-10.385c0-5.844 4.027-10.771 9.375-10.771s9.373 4.927 9.373 10.771v10.385h-3v-8.264c0-2.416-1.34-4.485-3.784-4.485-2.445 0-4.484 2.069-4.484 4.485v8.264h-3z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;