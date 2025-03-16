"use client"; // Add this if you're using client-side features (e.g., useEffect)
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaChartBar, FaRocket, FaUsers, FaChartPie } from "react-icons/fa";
import { motion } from "framer-motion"; // Import Fraclmer Motion
import Navbar from "../components/Navbar"; // Adjust the import path as needed
import Footer from "./Footer";

interface Stat {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode; // Use React.ReactNode for icons
}

export default function HomePage() {
  const [email, setEmail] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
      setIsLoggedIn(true);
    }
  }, []);

  const stats: Stat[] = [
    {
      id: 1,
      title: "Youth Ambition",
      description: "65% of Sri Lankan youth interested in entrepreneurship",
      icon: <FaChartBar className="text-4xl text-gray-800" />,
    },
    {
      id: 2,
      title: "Innovation Pipeline",
      description: "25+ emerging tech startups monthly",
      icon: <FaRocket className="text-4xl text-gray-800" />,
    },
    {
      id: 3,
      title: "Digital Momentum",
      description: "40% growth in local startup ecosystem",
      icon: <FaUsers className="text-4xl text-gray-800" />,
    },
    {
      id: 4,
      title: "Market Potential",
      description: "3.2M potential young entrepreneurs",
      icon: <FaChartPie className="text-4xl text-gray-800" />,
    },
  ];

  // Animation variants for cards (scroll-in)
  const cardVariants = {
    offscreen: {
      opacity: 0,
      y: 50,
    },
    onscreen: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  // Animation variants for card hover (professional effect)
  const cardHoverVariants = {
    hover: {
      y: -8, // Lift the card slightly
      scale: 1.03, // Subtle scale increase
      boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.15)", // Smooth shadow increase
      backgroundColor: "#F9FAFB", // Soft gray background fade
      transition: {
        type: "spring",
        stiffness: 400, // Smooth and fast response
        damping: 20, // Minimal bounce
        duration: 0.3,
      },
    },
    rest: {
      y: 0, // Reset to original position
      scale: 1, // Reset scale
      boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.1)", // Default shadow
      backgroundColor: "#FFFFFF", // Reset to white
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20,
        duration: 0.3,
      },
    },
  };

  // Animation variants for the icon on hover
  const iconHoverVariants = {
    hover: {
      scale: 1.1, // Subtle scale increase
      color: "#10B981", // Change to brand color (green)
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20,
        duration: 0.3,
      },
    },
    rest: {
      scale: 1, // Reset scale
      color: "#1F2937", // Reset to gray
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20,
        duration: 0.3,
      },
    },
  };

  // Animation variants for the text on hover
  const textHoverVariants = {
    hover: {
      color: "#111827", // Darken text slightly for emphasis
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20,
        duration: 0.3,
      },
    },
    rest: {
      color: "#4B5563", // Reset to original gray
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20,
        duration: 0.3,
      },
    },
  };

  // Animation variants for the image
  const imageVariants = {
    offscreen: {
      opacity: 0,
      scale: 0.8,
    },
    onscreen: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 1,
      },
    },
  };

  // Animation variants for the hero title
  const titleVariants = {
    offscreen: {
      opacity: 0,
      y: -20,
    },
    onscreen: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  // Animation variants for the CTA button
  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Use the modernized Navbar component */}
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 text-center bg-white/80 backdrop-blur-md">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 tracking-tight"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.8 }}
            variants={titleVariants}
          >
            Building Sri Lanka's Next Generation of Entrepreneurs
          </motion.h1>

          {/* Illustration and Stats Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Left Side Cards */}
              <div className="space-y-8">
                {stats.slice(0, 2).map((stat) => (
                  <motion.div
                    key={stat.id}
                    className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center"
                    initial="offscreen"
                    whileInView="onscreen"
                    viewport={{ once: true, amount: 0.8 }}
                    variants={cardVariants}
                    whileHover="hover" // Apply hover animations
                    animate="rest" // Default state
                  >
                    <motion.div
                      className="mb-4"
                      variants={iconHoverVariants}
                      initial="rest"
                      whileHover="hover"
                    >
                      {stat.icon}
                    </motion.div>
                    <motion.h3
                      className="text-xl font-semibold text-gray-800 mb-2 tracking-wide"
                      variants={textHoverVariants}
                      initial="rest"
                      whileHover="hover"
                    >
                      {stat.title}
                    </motion.h3>
                    <motion.p
                      className="text-gray-600 text-center text-sm"
                      variants={textHoverVariants}
                      initial="rest"
                      whileHover="hover"
                    >
                      {stat.description}
                    </motion.p>
                  </motion.div>
                ))}
              </div>

              {/* Center Image */}
              <motion.div
                className="flex justify-center pl-8 pr-8"
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.8 }}
                variants={imageVariants}
              >
                <Image
                  src="/image/main.png" // Adjust the path to your image
                  alt="Collaboration illustration"
                  width={384} // Adjust based on the actual image dimensions
                  height={256} // Adjust based on the actual image dimensions
                  className="object-contain"
                />
              </motion.div>

              {/* Right Side Cards */}
              <div className="space-y-8">
                {stats.slice(2, 4).map((stat) => (
                  <motion.div
                    key={stat.id}
                    className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center"
                    initial="offscreen"
                    whileInView="onscreen"
                    viewport={{ once: true, amount: 0.8 }}
                    variants={cardVariants}
                    whileHover="hover" // Apply hover animations
                    animate="rest" // Default state
                  >
                    <motion.div
                      className="mb-4"
                      variants={iconHoverVariants}
                      initial="rest"
                      whileHover="hover"
                    >
                      {stat.icon}
                    </motion.div>
                    <motion.h3
                      className="text-xl font-semibold text-gray-800 mb-2 tracking-wide"
                      variants={textHoverVariants}
                      initial="rest"
                      whileHover="hover"
                    >
                      {stat.title}
                    </motion.h3>
                    <motion.p
                      className="text-gray-600 text-center text-sm"
                      variants={textHoverVariants}
                      initial="rest"
                      whileHover="hover"
                    >
                      {stat.description}
                    </motion.p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-center">
          <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
            <a
              href={isLoggedIn ? "/contact" : "/pages/signup"}
              className="inline-flex items-center px-8 py-4 bg-green-500 text-white rounded-full font-semibold text-lg hover:bg-green-600 transition-all duration-300 shadow-md"
            >
              <span className="mr-2">Join Sri Lanka's Startup Revolution</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </motion.div>
        </section>
      </main>

      <Footer></Footer>
    </div>
  );
}