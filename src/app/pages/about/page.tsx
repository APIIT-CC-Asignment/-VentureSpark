// src/app/about/page.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import HeaderContent from '../../components/HeaderContent/headercontent';
import FooterContent from '../../components/FooterContent/footercontent';

export default function AboutPage() {
  const stats = [
    { value: '500+', label: 'Industry Mentors' },
    { value: '3.5x', label: 'Avg. Growth Rate' },
    { value: '80%', label: 'Success Rate' },
    { value: '1200+', label: 'Startups Supported' }
  ];

  const team = [
    {
      name: "Senesh Sandaruwan",
      title: "Business Strategist",
      expertise: "15+ Years in Tech Ecosystems",
      image: "/images/senesh.jpg",
      quote: "We don't just advise - we build champions."
    },
    {
      name: "Mihilayan Sachinthana",
      title: "Marketing Specialist",
      expertise: "Digital Marketing & Growth Hacking",
      image: "/images/mihi.jpeg",
      quote: "Technology should enable, not complicate."
    },
    {
      name: "Anuda Ranasinghe",
      title: "Financial Analyst",
      expertise: "Financial Modeling & Valuation", 
      image: "/images/anuda.jpg",
      quote: "The right connection changes everything."
    },
    {
      name: "Abdul Hakeem",
      title: "Technology Advisor",
      expertise: "AI & Blockchain Solutions",
      image: "/images/hakeem.avif",
      quote: "Precision in process creates freedom to innovate."
    },
    {
      name: "Zuhri Ashroff",
      title: "Legal Consultant",
      expertise: "Corporate Law & Compliance",
      image: "/images/zuhri.jpg",
      quote: "Precision in process creates freedom to innovate."
    }
  ];

  return (
    <div className="font-sans bg-gray-100">
      <HeaderContent />

      {/* Mission Statement - Commanding Header
      <section className="relative py-28 bg-[#1E3A8A] text-white">
        <div className="absolute inset-0 bg-black/30">
          <Image 
            src="/about/boardroom.jpg"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="border-l-4 border-[#F59E0B] pl-6 mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                BUILDING SRI LANKA'S NEXT GENERATION OF BUSINESS LEADERS
              </h1>
              <p className="text-xl opacity-90">
                We provide the strategic firepower startups need to dominate their markets.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.value}
                  className="bg-white/10 p-4 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 + 0.5 }}
                >
                  <div className="text-3xl font-bold text-[#F59E0B]">{stat.value}</div>
                  <div className="text-sm uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section> */}

          {/* Mission & Timeline Section */}
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        

        {/* Combat Timeline */}
        <div className="text-center mb-16 mt-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-4">
            OUR <span className="text-[#F59E0B]">MISSION</span> COMMAND
          </h2>
          <div className="w-24 h-1 bg-[#10B981] mx-auto mb-2"></div>
          <p className="text-gray-600 uppercase text-sm tracking-wider">
            Strategic milestones in our campaign for startup dominance
          </p>
        </div>

        {/* Mission with Group Photo */}
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-20 ml-12 mr-12">
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="border-l-4 border-[#F59E0B] pl-6 mb-6 text-justify">
              
              <p className="text-lg text-gray-700">
                To arm Sri Lankan entrepreneurs with the strategic weapons, tactical mentorship, 
                and operational support needed to dominate their markets and build lasting empires.
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sed voluptatem voluptas minima,
                nostrum dolorem provident vel incidunt minus dolor qui quibusdam repellendus velit? Veritatis, 
                laboriosam nobis quos ipsam odit ex?
              </p>
              
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                "Local Market Intelligence",
                "Elite Mentor Network",
                "Precision Growth Plans", 
                "Full Operational Support"
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-3 text-[#10B981]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="lg:w-1/2 relative h-96 rounded-xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Image
              src="/images/teamphoto.jpg"
              alt="Venture Spark team"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <p className="text-sm uppercase tracking-wider text-[#F59E0B]">Colombo Headquarters</p>
              <h3 className="text-xl font-bold">THE VENTURE SPARK UNIT</h3>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

          {/* Values - Battle-Tested Principles */}
      <section className="py-20 bg-green-300 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-[#F59E0B]">BATTLE-TESTED</span> PRINCIPLES
            </h2>
            <div className="w-24 h-1 bg-white mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "STRATEGIC FOCUS",
                description: "We target weaknesses and exploit opportunities with precision",
                icon: "🎯"
              },
              {
                title: "LOCAL INTELLIGENCE",
                description: "Ground-level understanding of Sri Lanka's business terrain",
                icon: "🗺️"
              },
              {
                title: "TECH FIREPOWER",
                description: "Cutting-edge tools to outmaneuver competition",
                icon: "💻"
              },
              {
                title: "NO RETREAT",
                description: "We stand with our startups through every challenge",
                icon: "🛡️"
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                className="bg-black/10 p-8 rounded-xl backdrop-blur-sm border border-white/10"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-[#F59E0B]">{value.title}</h3>
                <p className="text-black/90">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team - Special Forces Showcase */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-4">
              THE <span className="text-[#F59E0B]">SPECIALISTS</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our leadership team brings special forces precision to your startup's success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 ml-12 mr-12">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                className="bg-white rounded-xl overflow-hidden shadow-lg transform hover:-translate-y-2 transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="relative h-72">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover   transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-2xl font-bold text-white">{member.name}</h3>
                    <p className="text-[#F59E0B] font-medium">{member.title}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-sm uppercase tracking-wider text-[#10B981] mb-2">
                    {member.expertise}
                  </div>
                  <p className="text-gray-700 italic">"{member.quote}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      

      {/* CTA - Call to Arms */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            READY TO <span className="text-[#F59E0B]">ENGAGE?</span>
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-10">
            Schedule your strategy session with our elite mentors today.
          </p>
          <a
            href="/bookingpage"
            className="inline-block bg-[#F59E0B] hover:bg-[#D97706] text-black px-10 py-4 rounded-lg font-bold text-lg uppercase tracking-wider shadow-lg transition-all"
          >
            Deploy Resources
          </a>
        </div>
      </section>

      <FooterContent />
    </div>
  );
}