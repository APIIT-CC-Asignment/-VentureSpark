// src/app/contact/page.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import HeaderContent from '../../components/HeaderContent/headercontent';
import FooterContent from '../../components/FooterContent/footercontent';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Here you would handle the actual form submission
    console.log(formData);
    // Simulating a successful submission
    setIsSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  const contactInfo = [
    {
      title: 'Email Us',
      details: 'info@venturespark.com',
      icon: '/images/email.png'
    },
    {
      title: 'Call Us',
      details: '+94 11 234 5678',
      icon: '/images/phone.png'
    },
    {
      title: 'Visit Us',
      details: 'Mon-Fri, 9:00 AM - 5:00 PM',
      icon: '/images/clock.png'
    }
  ];

  return (
    <div className="font-sans bg-gray-50">
      <HeaderContent />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#1E3A8A] to-[#10B981] text-white pt-32 pb-20">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Get in Touch
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl max-w-3xl mx-auto mb-6 opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Have questions about our services? Ready to start your entrepreneurial journey?
            We're here to help.
          </motion.p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white -mt-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white rounded-xl shadow-lg p-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                className="text-center p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 mx-auto mb-4">
                  <Image
                    src={info.icon}
                    alt={info.title}
                    width={64}
                    height={64}
                  />
                </div>
                <div className="text-xl font-bold text-[#1E3A8A] mb-2">{info.title}</div>
                <p className="text-gray-600">{info.details}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-sm"
            >
              <h2 className="text-2xl font-bold text-[#1E3A8A] mb-6">Send Us a Message</h2>
              
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6"
                >
                  Thank you for your message! We'll get back to you shortly.
                </motion.div>
              ) : null}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-gray-700 mb-2">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 mb-2">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-6 py-3 rounded-full font-semibold text-lg shadow-md transition-all"
                >
                  Send Message
                </button>
              </form>
            </motion.div>
            
            {/* Map and Office Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-white p-8 rounded-xl shadow-sm mb-8">
                <h2 className="text-2xl font-bold text-[#1E3A8A] mb-6">Our Office</h2>
                <div className="aspect-video w-full bg-gray-200 rounded-lg overflow-hidden mb-6">
                 
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15843.463636629147!2d79.84932294680763!3d6.906633541592015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25965b24c69c1%3A0xe50886d0050a5ed5!2sColombo%2007%2C%20Colombo%2000700!5e0!3m2!1sen!2slk!4v1745315778736!5m2!1sen!2slk" width="1200" height="450" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 bg-[#10B981]/20 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-[#1E3A8A]">Address</h3>
                      <p className="text-gray-600">123 Innovation Drive, Colombo 07, Sri Lanka</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 bg-[#10B981]/20 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-[#1E3A8A]">Phone</h3>
                      <p className="text-gray-600">+94 11 234 5678</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 bg-[#10B981]/20 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-[#1E3A8A]">Email</h3>
                      <p className="text-gray-600">info@venturespark.lk</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold text-[#1E3A8A] mb-6">Business Hours</h2>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday:</span>
                    <span className="font-medium">9:00 AM - 5:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Saturday:</span>
                    <span className="font-medium">10:00 AM - 2:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Sunday:</span>
                    <span className="font-medium">Closed</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find quick answers to common questions about our services
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {[
              {
                question: "How quickly can you help me register my startup?",
                answer: "We typically complete the business registration process within 5-7 business days, depending on the complexity of your business structure."
              },
              {
                question: "What types of startups do you work with?",
                answer: "We support startups across all industries in Sri Lanka, with particular expertise in technology, e-commerce, hospitality, manufacturing, and service-based businesses."
              },
              {
                question: "How does the mentorship program work?",
                answer: "After an initial consultation, we'll match you with mentors from our network of 500+ experts based on your industry and specific needs. Mentorship includes regular sessions, progress tracking, and access to resources."
              },
              {
                question: "What makes Venture Spark different from other consultancies?",
                answer: "Our integrated approach combines local expertise with global best practices, and our focus on end-to-end support ensures you have all the resources needed throughout your startup journey."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="mb-6 bg-gray-50 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold text-[#1E3A8A] mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </motion.div>
            ))}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Business Idea?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-10">
              Schedule a consultation today and take the first step toward startup success
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/pages/booking"
                className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-all"
              >
                Book a Free Consultation
              </a>
              <a
                href="#"
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg border border-white/20 transition-all"
              >
                View Success Stories
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <FooterContent />
    </div>
  );
}