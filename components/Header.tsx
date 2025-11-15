
import React from 'react';
import { BookOpenIcon } from './icons/BookOpenIcon';

const Header = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 md:px-8 flex items-center">
        <BookOpenIcon className="h-8 w-8 text-indigo-500" />
        <h1 className="ml-3 text-2xl font-bold text-gray-800 dark:text-white">
          Note Sharing Platform
        </h1>
      </div>
    </header>
  );
};

export default Header;