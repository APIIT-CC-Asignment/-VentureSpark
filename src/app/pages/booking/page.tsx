// src/app/bookingpage/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import HeaderContent from '../../components/HeaderContent/headercontent';
import FooterContent from '@/app/components/FooterContent/footercontent';

type ConsultantType = 'finance' | 'legal' | 'business' | '';
type Consultant = {
  id: string;
  name: string;
  type: ConsultantType;
  description: string;
  image: string;
};

const consultants: Consultant[] = [
  { id: 'f1', name: 'John Doe', type: 'finance', description: 'Expert in startup funding', image: '/images/face.jpg' },
  { id: 'f2', name: 'Jane Smith', type: 'finance', description: 'Financial planning specialist', image: '/images/face.jpg' },
  { id: 'f3', name: 'Mike Ross', type: 'finance', description: 'Budget optimization guru', image: '/images/face.jpg' },
  { id: 'l1', name: 'Sarah Lee', type: 'legal', description: 'Contract law expert', image: '/images/face.jpg' },
  { id: 'l2', name: 'Tom Clark', type: 'legal', description: 'Compliance specialist', image: '/images/face.jpg' },
  { id: 'l3', name: 'Emily Brown', type: 'legal', description: 'IP law advisor', image: '/images/face.jpg' },
  { id: 'b1', name: 'Alex King', type: 'business', description: 'Growth strategist', image: '/images/face.jpg' },
  { id: 'b2', name: 'Lisa White', type: 'business', description: 'Market entry expert', image: '/images/face.jpg' },
  { id: 'b3', name: 'David Blue', type: 'business', description: 'Business scaling pro', image: '/images/face.jpg' },
];

export default function BookingPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    message: '',
  });
  const [minDate, setMinDate] = useState<string>('');

  useEffect(() => {
    setIsMounted(true);
    setMinDate(new Date().toISOString().split('T')[0]);
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Booking submitted:', { ...formData, consultant: selectedConsultant });
    setFormData({ name: '', email: '', date: '', message: '' });
    setSelectedConsultant(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const scrollToForm = (consultant: Consultant) => {
    setSelectedConsultant(consultant);
    document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="pt-20 text-center text-[#1E3A8A]">Loading...</div>
      </div>
    );
  }

  return (
    <div className=" font-sans bg-gray-50">
      <HeaderContent />

      {/* Banner Section */}
      <motion.section
        id="banner"
        className="pt-50 pb-20 text-center bg-gradient-to-b from-[#1E3A8A] to-[#10B981]"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold text-white max-w-4xl mx-auto mb-6"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Elevate Your Startup
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl max-w-2xl mx-auto mb-10 text-white/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Partner with experts to drive your success.
        </motion.p>
        <motion.a
          href="#consultants"
          className="inline-block bg-[#F59E0B] text-white px-10 py-4 rounded-full font-semibold text-lg shadow-md"
          whileHover={{ scale: 1.1, boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          Discover Experts
        </motion.a>
      </motion.section>

      {/* Consultants Section */}
      <section id="consultants" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-4xl font-bold text-[#1E3A8A] mb-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Meet Your Growth Partners
        </motion.h2>

        {['finance', 'legal', 'business'].map((type, index) => (
          <motion.div
            key={type}
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <h3 className="text-3xl font-semibold text-[#1E3A8A] mb-8 capitalize">
              {type} Expertise
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {consultants.filter(c => c.type === type).map(consultant => (
                <motion.div
                  key={consultant.id}
                  className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(30, 58, 138, 0.15)' }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={consultant.image}
                    alt={consultant.name}
                    width={150}
                    height={150}
                    className="rounded-full mx-auto mb-6 border-4 border-[#10B981]/20"
                  />
                  <h4 className="text-xl font-semibold text-[#1E3A8A]">{consultant.name}</h4>
                  <p className="text-gray-600 mb-6">{consultant.description}</p>
                  <motion.button
                    onClick={() => scrollToForm(consultant)}
                    className="w-full bg-[#10B981] text-white px-4 py-3 rounded-full font-medium"
                    whileHover={{ scale: 1.05, backgroundColor: '#059669' }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    Schedule Now
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </section>

      {/* Booking Form Section */}
      {selectedConsultant && (
        <motion.section
          id="booking-form"
          className="py-20 bg-white"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-[#1E3A8A] mb-10 text-center">
              Book {selectedConsultant.name}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-lg border border-[#1E3A8A]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-lg border border-[#1E3A8A]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={minDate}
                  className="w-full px-5 py-3 rounded-lg border border-[#1E3A8A]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Needs
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-5 py-3 rounded-lg border border-[#1E3A8A]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all"
                  placeholder="What do you want to achieve?"
                />
              </div>

              <motion.button
                type="submit"
                className="w-full bg-[#F59E0B] text-white px-6 py-4 rounded-full font-semibold text-lg shadow-md"
                whileHover={{ scale: 1.05, boxShadow: '0 6px 20px rgba(245, 158, 11, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Lock in Your Session
              </motion.button>
            </form>
          </div>
        </motion.section>
      )}

      {/* Footer */}
      <FooterContent />

    </div>
  );
}