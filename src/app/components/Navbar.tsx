"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-green-500 tracking-tight">
          VentureSpark
        </Link>

        <div className="hidden md:flex space-x-8">
          {["About", "Services", "Blog", "Contact"].map((item) => (
            <motion.div key={item} whileHover={{ scale: 1.1, color: "#10B981" }}>
              <Link href={`/${item.toLowerCase()}`} className="text-gray-700 font-medium text-lg tracking-wide hover:text-green-500">
                {item}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {email ? (
            <div className="flex items-center space-x-4">
              {image && (
                <img
                  src={image}
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
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/pages/loginpage" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-medium shadow-md">
                Login
              </Link>
            </motion.div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-500 hover:text-green-500 focus:outline-none">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 bg-white/95 backdrop-blur-md z-40 mt-16 shadow-lg z-40 "
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="flex flex-col items-start px-6 py-4 space-y-4">
              {["Home", "Services", "Mentors", "Resources"].map((item) => (
                <motion.div key={item} whileHover={{ x: 10 }} whileTap={{ scale: 0.95 }}>
                  <Link href={`/${item.toLowerCase()}`} className="block text-gray-700 hover:text-green-500 font-medium text-lg py-2" onClick={() => setIsMenuOpen(false)}>
                    {item}
                  </Link>
                </motion.div>
              ))}
              {email ? (
                <div className="flex flex-col w-full space-y-4 pt-4 border-t border-gray-200">
                  <span className="text-gray-600 font-medium text-sm truncate">{email}</span>
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
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
                  <Link href="/pages/loginpage" className="block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-medium shadow-md text-center w-full" onClick={() => setIsMenuOpen(false)}>
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
