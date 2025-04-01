// src/app/page.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import HeaderContent from './components/HeaderContent/headercontent';
import FooterContent from './components/FooterContent/footercontent';
import { useState, useEffect } from 'react';

export default function Home() {
  const stats = [
    { value: '3.5x', label: 'Faster Growth with Mentorship' },
    { value: '80%', label: 'Higher Success Rate' },
    { value: '500+', label: 'Expert Mentors' },
  ];

  const services = [
    {
      title: 'Business Registration',
      description: 'Simplified process for registering your startup in Sri Lanka',
      icon: '/images/br.png'
    },
    {
      title: 'Localized Expertise',
      description: 'Tailored guidance for Sri Lankan startups with deep market understanding',
      icon: '/images/expertise.png'
    },
    {
      title: 'End-to-End Support',
      description: 'From idea validation to market launch and scaling operations',
      icon: '/images/support.png'
    },
    {
      title: 'Mentorship Network',
      description: 'Access to 500+ industry veterans across all business domains',
      icon: '/images/mentor.png'
    },
    {
      title: 'Financial Modeling & Funding',
      description: 'Comprehensive financial planning and funding strategies',
      icon: '/images/funding.png'
    },
    {
      title: 'Operational Excellence',
      description: 'Streamlined processes and tech integration for maximum efficiency',
      icon: '/images/10521212.png'
    }
  ];

  const roadmap = [
    { 
      step: '1', 
      title: 'Validate Your Vision', 
      description: 'Market research and business registration complete' 
    },
    { 
      step: '2', 
      title: 'Build Your Foundation', 
      description: 'Core team and processes established' 
    },
    { 
      step: '3', 
      title: 'Get Launch Ready', 
      description: 'Resources secured and systems in place' 
    },
    { 
      step: '4', 
      title: 'Enter the Market', 
      description: 'Product launched and customer base growing' 
    },
    { 
      step: '5', 
      title: 'Scale & Thrive', 
      description: 'Expansion and market leadership achieved' 
    }
  ];

  return (
    <div className="font-sans bg-gray-50">
      <HeaderContent />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#1E3A8A] to-[#10B981] text-white pt-32 pb-40">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Launch & Scale Your Sri Lankan Startup
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Venture Spark provides localized solutions, strategic mentorship, and personalized growth support to transform your ideas into successful ventures.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <a
              href="/booking"
              className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-all"
            >
              Book a Consultation
            </a>
            <a
              href="#services"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg border border-white/20 transition-all"
            >
              Explore Services
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white -mt-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white rounded-xl shadow-lg p-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.value}
                className="text-center p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-5xl font-bold text-[#1E3A8A] mb-3">{stat.value}</div>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-4">The Entrepreneurial Challenge</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              75% of Sri Lankan startups struggle with fragmented resources and disconnected support systems
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Image
                src="/images/Homeimg01.jpg"
                alt="Startup challenges"
                width={600}
                height={400}
                className="lg:ml-24"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold text-[#1E3A8A] mb-6 lg:ml-24">Pain Points We Solve</h3>
              <ul className="space-y-4 lg:ml-24">
                {[
                  "Complex regulatory maze for new businesses",
                  "Disconnected support systems and resources",
                  "Limited access to experienced mentors",
                  "Financial planning and funding hurdles",
                  "Operational complexity slowing growth"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 bg-[#10B981] rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <p className="ml-3 text-gray-700">{item}</p>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-4">Our Comprehensive Solution</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything your startup needs in one integrated platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:ml-12 lg:mr-12 ">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                  <Image
                    src={service.icon}
                    alt={service.title}
                    width={60}
                    height={60}
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#1E3A8A] mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

            {/* Roadmap Section */}
      <section className="py-20 bg-gradient-to-b from-[#10B981]/10 to-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-4">Your Roadmap to Success</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We guide you through every stage of your startup journey
            </p>
          </motion.div>

          <div className="relative">
            {/* Central vertical line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-[#10B981]/20 transform -translate-x-1/2"></div>
            
            <div className="space-y-12 lg:space-y-0">
              {roadmap.map((item, index) => (
                <motion.div
                  key={item.step}
                  className="relative lg:flex lg:items-center lg:justify-between"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* Left-aligned content (odd steps) */}
                  <div className={`lg:w-5/12 ${index % 2 === 0 ? '' : 'lg:order-last'}`}>
                    <div className="bg-white p-8 rounded-xl shadow-sm">
                      <div className="text-2xl font-bold text-[#10B981] mb-2">Step {item.step}</div>
                      <h3 className="text-xl font-semibold text-[#1E3A8A] mb-3">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>

                  {/* Central circle - always centered */}
                  <div className="hidden lg:flex items-center justify-center w-2/12 absolute left-1/2 transform -translate-x-1/2">
                    <div className="w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center text-white text-xl font-bold z-10">
                      {item.step}
                    </div>
                  </div>

                  {/* Right-aligned content (even steps) - empty div for spacing */}
                  <div className={`lg:w-5/12 ${index % 2 === 0 ? '' : ''}`}></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1E3A8A] text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Launch Your Startup?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-10">
              Join Sri Lanka's fastest growing startup ecosystem with Venture Spark today
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/bookingpage"
                className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-all"
              >
                Book Your First Session
              </a>
              <a
                href="#"
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg border border-white/20 transition-all"
              >
                Learn More
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <FooterContent />
    </div>
  );
}