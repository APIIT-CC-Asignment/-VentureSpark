// src/app/resources/page.tsx
"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import HeaderContent from "../../components/HeaderContent/headercontent";
import FooterContent from "../../components/FooterContent/footercontent";

// Type definitions
interface Article {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  date: string;
  url: string;
}

interface Tool {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: string;
  url: string;
}

interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  image: string;
  downloadUrl: string;
}

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  source: string;
  date: string;
  url: string;
  image: string;
}

interface TaxUpdate {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
  impact: "high" | "medium" | "low";
}

export default function Resources() {
  // Filter state
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeSection, setActiveSection] = useState("articles");
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data - In a real app, this would come from an API
  const articles: Article[] = [
    {
      id: 1,
      title: "How to Validate Your Startup Idea in 30 Days",
      description:
        "A step-by-step guide to testing your business concept before investing significant resources.",
      category: "entrepreneurship",
      image: "/images/mihi.jpg",
      date: "2025-04-01",
      url: "#",
    },
    { 
      id: 2,
      title: "Startup Funding Options in Sri Lanka",
      description:
        "Comprehensive overview of equity, debt, grants, and alternative financing available locally.",
      category: "funding",
      image: "/images/resources/funding.jpg",
      date: "2025-03-22",
      url: "#",
    },
    {
      id: 3,
      title: "Building a Minimum Viable Product That Customers Actually Want",
      description:
        "Learn the strategies to create an MVP that addresses real customer pain points.",
      category: "product",
      image: "/images/resources/mvp.jpg",
      date: "2025-03-15",
      url: "#",
    },
    {
      id: 4,
      title: "Scaling Your Startup: When and How to Grow",
      description:
        "Strategic approaches to scaling operations, team, and customer base sustainably.",
      category: "growth",
      image: "/images/resources/scaling.jpg",
      date: "2025-03-10",
      url: "#",
    },
    {
      id: 5,
      title: "Tax Planning Essentials for Sri Lankan Startups",
      description:
        "Optimize your tax position while maintaining full compliance with local regulations.",
      category: "tax",
      image: "/images/resources/tax-planning.jpg",
      date: "2025-03-05",
      url: "#",
    },
    {
      id: 6,
      title: "Digital Marketing Strategies for Early-Stage Startups",
      description:
        "Cost-effective approaches to building brand awareness and acquiring customers.",
      category: "marketing",
      image: "/images/resources/digital-marketing.jpg",
      date: "2025-02-28",
      url: "#",
    },
  ];

  const tools: Tool[] = [
    {
      id: 1,
      name: "Startup Financial Projections Calculator",
      description:
        "Generate 3-year financial projections based on customizable growth assumptions.",
      category: "finance",
      icon: "/images/resources/calculator-icon.png",
      url: "#",
    },
    {
      id: 2,
      name: "Business Model Canvas Builder",
      description:
        "Interactive tool to design and iterate your business model with expert guidance.",
      category: "planning",
      icon: "/images/resources/canvas-icon.png",
      url: "#",
    },
    {
      id: 3,
      name: "Investor Pitch Deck Analyzer",
      description:
        "AI-powered tool that reviews your pitch deck and provides improvement suggestions.",
      category: "funding",
      icon: "/images/resources/pitch-icon.png",
      url: "#",
    },
    {
      id: 4,
      name: "Customer Validation Survey Builder",
      description:
        "Create effective surveys to validate your product idea and pricing strategy.",
      category: "product",
      icon: "/images/resources/survey-icon.png",
      url: "#",
    },
    {
      id: 5,
      name: "Sri Lankan Business Registration Assistant",
      description:
        "Step-by-step guide to registering your business entity in Sri Lanka.",
      category: "legal",
      icon: "/images/resources/registration-icon.png",
      url: "#",
    },
    {
      id: 6,
      name: "Digital Marketing ROI Calculator",
      description:
        "Measure and optimize the return on investment for your marketing campaigns.",
      category: "marketing",
      icon: "/images/resources/roi-icon.png",
      url: "#",
    },
  ];

  const templates: Template[] = [
    {
      id: 1,
      name: "Startup Investor Agreement",
      description:
        "Legally reviewed investment agreement template for early-stage funding rounds.",
      category: "legal",
      image: "/images/resources/legal-doc.jpg",
      downloadUrl: "#",
    },
    {
      id: 2,
      name: "Employee Hiring Bundle",
      description:
        "Complete set of employment contracts, offer letters, and onboarding documents.",
      category: "hr",
      image: "/images/resources/hiring-doc.jpg",
      downloadUrl: "#",
    },
    {
      id: 3,
      name: "Financial Model for SaaS Startups",
      description:
        "Comprehensive Excel model with revenue projections, burn rate, and key SaaS metrics.",
      category: "finance",
      image: "/images/resources/finance-doc.jpg",
      downloadUrl: "#",
    },
    {
      id: 4,
      name: "Marketing Strategy Blueprint",
      description:
        "Strategic framework for planning, executing, and measuring marketing initiatives.",
      category: "marketing",
      image: "/images/resources/marketing-doc.jpg",
      downloadUrl: "#",
    },
    {
      id: 5,
      name: "Pitch Deck Template",
      description:
        "Professional slide deck template designed to impress investors and showcase your vision.",
      category: "funding",
      image: "/images/resources/pitch-deck.jpg",
      downloadUrl: "#",
    },
    {
      id: 6,
      name: "Product Roadmap Template",
      description:
        "Visual roadmap template to plan and communicate your product development strategy.",
      category: "product",
      image: "/images/resources/roadmap-doc.jpg",
      downloadUrl: "#",
    },
  ];

  const news: NewsItem[] = [
    {
      id: 1,
      title: "Sri Lanka Launches $20M Startup Innovation Fund",
      summary:
        "New government initiative aims to boost tech entrepreneurship with seed funding and mentorship.",
      source: "Tech Daily",
      date: "2025-04-10",
      url: "#",
      image: "/images/resources/innovation-fund.jpg",
    },
    {
      id: 2,
      title: "Local Fintech Raises $5M Series A Round",
      summary:
        "PayEasy secures major investment to expand digital payment solutions across South Asia.",
      source: "Startup Journal",
      date: "2025-04-05",
      url: "#",
      image: "/images/resources/fintech-news.jpg",
    },
    {
      id: 3,
      title: "Colombo Tech Hub Opening Accelerates Startup Growth",
      summary:
        "New co-working and innovation center in Colombo attracts 50+ startups in first month.",
      source: "Business Insider",
      date: "2025-03-28",
      url: "#",
      image: "/images/resources/tech-hub.jpg",
    },
    {
      id: 4,
      title: "E-commerce Adoption Jumps 40% in Sri Lanka",
      summary:
        "Post-pandemic shift creates opportunities for digital retail and logistics startups.",
      source: "Digital Economy Report",
      date: "2025-03-20",
      url: "#",
      image: "/images/resources/ecommerce.jpg",
    },
  ];

  const taxUpdates: TaxUpdate[] = [
    {
      id: 1,
      title: "New Tax Incentives for Tech Startups",
      description:
        "Five-year tax holiday announced for qualifying technology startups in specified sectors.",
      date: "2025-04-15",
      category: "tax incentive",
      impact: "high",
    },
    {
      id: 2,
      title: "Changes to Corporate Income Tax Rates",
      description:
        "Revised structure for small and medium enterprises with revenue under 50M LKR.",
      date: "2025-04-01",
      category: "tax rates",
      impact: "medium",
    },
    {
      id: 3,
      title: "Digital Service Tax Implementation",
      description:
        "New 5% tax on digital services provided by non-resident companies to take effect June 2025.",
      date: "2025-03-22",
      category: "new tax",
      impact: "medium",
    },
    {
      id: 4,
      title: "VAT Threshold Adjustment",
      description:
        "Registration threshold increased from 15M to 20M LKR annual turnover.",
      date: "2025-03-15",
      category: "vat",
      impact: "low",
    },
  ];

  // Filter functions
  const filterItems = (items: any[], category: string) => {
    if (category === "all") return items;
    return items.filter((item) => item.category === category);
  };

  const searchItems = (items: any[]) => {
    if (!searchTerm) return items;
    const term = searchTerm.toLowerCase();

    return items.filter((item) => {
      // Search in all string properties of an item
      return Object.keys(item).some((key) => {
        if (typeof item[key] === "string") {
          return item[key].toLowerCase().includes(term);
        }
        return false;
      });
    });
  };

  // Get categories for the active section
  const getCategories = () => {
    let items;
    switch (activeSection) {
      case "articles":
        items = articles;
        break;
      case "tools":
        items = tools;
        break;
      case "templates":
        items = templates;
        break;
      default:
        items = articles;
    }

    const categories = ["all", ...new Set(items.map((item) => item.category))];
    return categories;
  };

  // Get filtered and searched items for active section
  const getFilteredItems = () => {
    let items;
    switch (activeSection) {
      case "articles":
        items = articles;
        break;
      case "tools":
        items = tools;
        break;
      case "templates":
        items = templates;
        break;
      case "news":
        items = news;

        break;
      case "tax":
        items = taxUpdates;
        break;
      default:
        items = articles;
    }

    const filtered = filterItems(items, activeFilter);
    return searchItems(filtered);
  };

  // For filtering categories
  useEffect(() => {
    // Reset filter when changing sections
    setActiveFilter("all");
  }, [activeSection]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
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
            Startup Resources
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl max-w-3xl mx-auto mb-6 opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Curated tools, templates, and knowledge to accelerate your
            entrepreneurial journey
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 -mt-16">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="w-full px-5 py-4 pr-12 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute right-4 top-4">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap border-b border-gray-200 mb-8">
              {["articles", "tools", "templates", "news", "tax"].map(
                (section) => (
                  <button
                    key={section}
                    className={`px-6 py-3 font-medium text-lg transition-colors duration-200 ease-in-out ${
                      activeSection === section
                        ? "text-[#1E3A8A] border-b-2 border-[#1E3A8A]"
                        : "text-gray-500 hover:text-[#1E3A8A]"
                    }`}
                    onClick={() => setActiveSection(section)}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                )
              )}
            </div>

            {/* Category Filters - Only show for Articles, Tools, Templates */}
            {["articles", "tools", "templates"].includes(activeSection) && (
              <div className="flex flex-wrap gap-2 mb-8">
                {getCategories().map((category) => (
                  <button
                    key={category}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeFilter === category
                        ? "bg-[#1E3A8A] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    onClick={() => setActiveFilter(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            )}

            {/* Content Grid / List */}
            {activeSection === "articles" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {getFilteredItems().map((article: Article) => (
                  <motion.div
                    key={article.id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, delay: article.id * 0.1 }}
                  >
                    <div className="h-48 bg-gray-200 relative">
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        <span>Image: {article.image}</span>
                      </div>
                      <div className="absolute top-4 left-4 bg-[#10B981]/90 text-white text-xs px-2 py-1 rounded-full">
                        {article.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-[#1E3A8A] mb-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {article.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {new Date(article.date).toLocaleDateString()}
                        </span>
                        <a
                          href={article.url}
                          className="text-[#10B981] font-medium hover:underline"
                        >
                          Read more
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeSection === "tools" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {getFilteredItems().map((tool: Tool) => (
                  <motion.div
                    key={tool.id}
                    className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-start"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, delay: tool.id * 0.1 }}
                  >
                    <div className="w-12 h-12 bg-[#1E3A8A]/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <div className="text-[#1E3A8A] text-lg font-bold">
                        {tool.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-[#10B981] uppercase mb-1">
                        {tool.category}
                      </div>
                      <h3 className="text-lg font-bold text-[#1E3A8A] mb-2">
                        {tool.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {tool.description}
                      </p>
                      <a
                        href={tool.url}
                        className="bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 text-[#F59E0B] font-medium px-4 py-2 rounded-full text-sm inline-block transition-colors"
                      >
                        Access Tool
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeSection === "templates" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {getFilteredItems().map((template: Template) => (
                  <motion.div
                    key={template.id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, delay: template.id * 0.1 }}
                  >
                    <div className="h-32 bg-gray-100 relative">
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span>Template Preview: {template.image}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-[#10B981] px-3 py-1 bg-[#10B981]/10 rounded-full">
                          {template.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#1E3A8A] mb-2">
                        {template.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {template.description}
                      </p>
                      <a
                        href={template.downloadUrl}
                        className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-medium px-4 py-2 rounded-full text-sm inline-block transition-colors w-full text-center"
                      >
                        Download Template
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeSection === "news" && (
              <div className="space-y-6">
                {news.map((item: NewsItem) => (
                  <motion.div
                    key={item.id}
                    className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, delay: item.id * 0.1 }}
                  >
                    <div className="w-full md:w-1/4 h-48 md:h-auto bg-gray-200 rounded-lg overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span>Image: {item.image}</span>
                      </div>
                    </div>
                    <div className="md:w-3/4">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <span>{item.source}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-[#1E3A8A] mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{item.summary}</p>
                      <a
                        href={item.url}
                        className="text-[#10B981] font-medium hover:underline"
                      >
                        Read full article →
                      </a>
                    </div>
                  </motion.div>
                ))}

                
              </div>
              
            )}

            {activeSection === "tax" && (
              <div className="space-y-4">
                {taxUpdates.map((update: TaxUpdate) => (
                  <motion.div
                    key={update.id}
                    className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, delay: update.id * 0.1 }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
                      <h3 className="text-xl font-bold text-[#1E3A8A]">
                        {update.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">
                          {new Date(update.date).toLocaleDateString()}
                        </span>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            update.impact === "high"
                              ? "bg-red-100 text-red-600"
                              : update.impact === "medium"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {update.impact.toUpperCase()} IMPACT
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                        {update.category}
                      </span>
                    </div>
                    <p className="text-gray-700">{update.description}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {getFilteredItems().length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  No results found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter to find what you're
                  looking for.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>



      {/* Newsletter Section */}
      <section className="py-16 bg-[#1E3A8A]/5">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              className="text-3xl font-bold text-[#1E3A8A] mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Stay Updated with Startup Resources
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Subscribe to our newsletter for the latest industry insights, tax
              updates, and startup resources
            </motion.p>
            <motion.form
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                required
              />
              <button
                type="submit"
                className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Subscribe
              </button>
            </motion.form>
          </div>
        </div>
      </section>


      <section className="py-16 bg-white">
  <div className="container mx-auto px-4 sm:px-6">
    <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-800 to-emerald-500 rounded-2xl shadow-lg p-6 md:p-8 text-white">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Latest News</h2>
          <p className="opacity-90 mb-4 max-w-md">
            Stay updated with the latest articles, tools, and resources 
            that can help entrepreneurs grow their business.
          </p>
        </div>
        <div className="w-full md:w-auto">
          <a
            href="/pages/News"
            className="bg-white text-blue-800 px-6 py-3 rounded-full font-medium inline-block hover:bg-gray-100 transition-colors duration-300 shadow-md w-full md:w-auto text-center"
          >
            View All News
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Suggestion Box */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#1E3A8A] to-[#10B981] rounded-2xl p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-3">Suggest a Resource</h2>
                <p className="opacity-90 mb-4">
                  Know of a great tool, article, or template that would benefit
                  other entrepreneurs? Share it with our community!
                </p>
              </div>
              <div>
                <a
                  href="#"
                  className="bg-white text-[#1E3A8A] px-6 py-3 rounded-full font-medium inline-block hover:bg-gray-100 transition-colors"
                >
                  Submit
                </a>
              </div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Need Personalized Guidance?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-10">
              Our experts can help you navigate the complexities of launching
              and growing your business
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/pages/booking"
                className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-all"
              >
                Book a Free Consultation
              </a>
              <a
                href="/contact"
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg border border-white/20 transition-all"
              >
                Contact Our Team
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <FooterContent />
    </div>
  );
}
