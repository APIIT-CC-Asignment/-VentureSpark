'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MenuLink from '../MenuLink/MenuLink';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';

function HeaderContent() {
  const [email, setEmail] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null); // Ref for dropdown
  const profileRef = useRef<HTMLAnchorElement | null>(null); // Ref for profile icon

  useEffect(() => {
    if (typeof window !== "undefined") {
      setEmail(localStorage.getItem("email"));
      setImage(localStorage.getItem("image") || "/default-avatar.png");
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("image");

      setEmail(null);
      setImage(null);
      window.location.reload();
    }
  };

  const menuVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: "100%", opacity: 0 },
  };

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // Mobile Menu State
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const toggleDropdown = () => setIsDropdownVisible(!isDropdownVisible);

  return (
    <header className={`
      rounded fixed top-1 left-5 right-5 bg-white/90 backdrop-blur-md shadow-md z-50 border border-gray-200 transition-all duration-300 ease-in-out
      ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-1' : 'bg-white/90 backdrop-blur-md py-1'}
    `}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex-shrink-0 flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src="/images/logo.png"
              alt="Company Logo"
              className="h-8 w-auto md:h-10"
            />
          </motion.a>

          {/* Centered Navigation */}
          <div className="hidden md:flex flex-1 justify-center">
            <MenuLink />
          </div>

          {/* Right Side Buttons */}
          <div className="hidden md:flex items-center space-x-8">
            <motion.a
              href="/pages/booking"
              className="px-4 py-2 rounded-2xl bg-green-600 text-white font-medium hover:bg-green-700 shadow-sm"
              whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(74, 222, 128, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              Book a Session
            </motion.a>

            {/* Profile Icon */}
            {email ? (
              <motion.a
                className="p-2 rounded-full bg-gray-200 text-green-700 hover:bg-gray-300 shadow-sm"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                ref={profileRef}
                onClick={toggleDropdown} // Toggle dropdown visibility on click
              >
                <img
                  src={image || "/default-avatar.png"}
                  alt="User Profile"
                  className="w-10 h-10 rounded-full border border-gray-300"
                  onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
                />
              </motion.a>
            ) : (
              <motion.a
                href="/pages/loginpage"
                className="p-2 rounded-full bg-gray-200 text-green-700 hover:bg-gray-300 shadow-sm"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <FaUser className="w-6 h-6" />
              </motion.a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Profile Dropdown - Desktop */}
      {isDropdownVisible && (
        <motion.div
          className="absolute right-0 mt-2 p-4 bg-white rounded-lg shadow-lg w-48 hidden lg:block"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          ref={dropdownRef} // Attach ref to dropdown
        >
          {email ? (
            <div className="flex items-center space-x-4">
              
              <span className="text-gray-600 font-medium text-sm truncate max-w-[200px]">
                {email}
              </span>
            </div>
          ) : (
            <span className="text-gray-600 font-medium text-sm">Guest</span>
          )}

          {/* Logout Button */}
          {email && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="mt-2 text-black px-4 py-2  font-medium "
            >
              Logout
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Mobile Menu - Centered Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-2 pt-2 pb-4 bg-white border-t border-gray-200">
              <div className="flex flex-col items-center w-full">
                <MenuLink mobile />
                <motion.a
                  href="/pages/booking"
                  className="w-full max-w-xs px-6 py-3 rounded-full bg-green-600 text-white font-medium shadow-sm mt-4 text-center"
                  whileTap={{ scale: 0.98 }}
                >
                  Book a Session
                </motion.a>

                {email ? (
            <div className="flex items-center space-x-4 mt-4">
              {image && (
                <img
                  src={image || "/default-avatar.png"}
                  alt="User Profile"
                  className="w-10 h-10 rounded-full border border-gray-300"
                  onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
                />
              )}
              <span className="text-gray-600 font-medium text-sm truncate max-w-[200px]">
                {email}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-medium shadow-md"
              > 
                Logout
              </motion.button>
            </div>
          ) : (
            
                  <motion.a
                    href="/pages/loginpage"
                    className="mt-4 p-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-sm"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaUser className="w-6 h-6" />
                    
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default HeaderContent;
