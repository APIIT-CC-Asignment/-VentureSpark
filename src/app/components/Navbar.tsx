"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion"; 

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  // Animation variants for mobile menu
  const menuVariants = {
    closed: {
      x: "100%",
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    open: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  // Animation variants for desktop menu items
  const linkVariants = {
    hover: {
      scale: 1.1,
      color: "#10B981",
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-green-500 tracking-tight">
            VentureSpark
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          {["About", "Services", "Blog", "Contact"].map((item) => (
            <motion.div key={item} whileHover="hover" variants={linkVariants}>
              <Link
                href={`/${item.toLowerCase()}`}
                className="text-gray-700 font-medium text-lg tracking-wide transition-colors duration-300 hover:text-green-500"
              >
                {item}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* User Menu (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {email ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 font-medium text-sm truncate max-w-[200px]">
                {email}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("email");
                  window.location.href = "/pages/loginpage";
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-md"
              >
                Logout
              </motion.button>
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/pages/loginpage"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-md"
              >
                Login
              </Link>
            </motion.div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-500 hover:text-green-500 focus:outline-none transition-colors duration-300"
            aria-label="Toggle Menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu (Slide-in) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 bg-white/95 backdrop-blur-md z-40 mt-16 shadow-lg"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="flex flex-col items-start px-6 py-4 space-y-4">
              {["Home", "Services", "Mentors", "Resources"].map((item) => (
                <motion.div
                  key={item}
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full"
                >
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="block text-gray-700 hover:text-green-500 font-medium text-lg py-2 transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)} 
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
              {email ? (
                <div className="flex flex-col w-full space-y-4 pt-4 border-t border-gray-200">
                  <span className="text-gray-600 font-medium text-sm truncate">
                    {email}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("email");
                      window.location.href = "/pages/loginpage";
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-md w-full text-left"
                  >
                    Logout
                  </motion.button>
                </div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
                  <Link
                    href="/pages/loginpage"
                    className="block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-md w-full text-center"
                    onClick={() => setIsMenuOpen(false)} 
                  >
                    Login
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}