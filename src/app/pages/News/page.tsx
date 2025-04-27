// src/components/NewsSection/newssection.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import HeaderContent from '@/app/components/HeaderContent/headercontent';
import FooterContent from '@/app/components/FooterContent/footercontent';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  source: string;
  date: string;
  url: string;
  image: string;
  category?: string;
}

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Fetch news data from API
  useEffect(() => {
    async function fetchNews() {
      try {
        setIsLoading(true);
        
        // Replace with your actual API endpoint
        const response = await fetch('/api/startup-news');
        
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        
        const data = await response.json();
        setNews(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load latest news. Please try again later.');
        
        // Fallback to local sample data if fetch fails
        setNews(sampleNewsData);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchNews();
    
    // Set up auto-refresh every 30 minutes (adjust as needed)
    const refreshInterval = setInterval(fetchNews, 30 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Filter news based on search term and category
  const filteredNews = news.filter((item) => {
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.source.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === 'all' || 
      (item.category && item.category === categoryFilter);
      
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories from news data
  const categories = ['all', ...Array.from(new Set(news.filter(item => item.category).map(item => item.category)))];

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <HeaderContent />
    <div className="py-12">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-4 mt-28">Startup Ecosystem News</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest happenings in the startup ecosystem, funding rounds, and policy changes
          </p>
        </motion.div>

        {/* Search and filter controls */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-auto md:flex-grow md:max-w-md">
            <input
              type="text"
              placeholder="Search news..."
              className="w-full px-4 py-3 pr-10 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute right-3 top-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    categoryFilter === category
                      ? 'bg-[#1E3A8A] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => category && setCategoryFilter(category)}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* News content */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">
              {error}
            </div>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No news found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredNews.map((item) => (
              <motion.div
                key={item.id}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="w-full md:w-1/4 h-48 md:h-auto bg-gray-200 rounded-lg overflow-hidden relative">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  )}
                </div>
                <div className="md:w-3/4">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>{item.source}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                    {item.category && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="bg-[#10B981]/10 text-[#10B981] px-2 py-0.5 rounded-full text-xs">
                          {item.category}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-[#1E3A8A] mb-3">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.summary}</p>
                  <a 
                    href={item.url}
                    className="text-[#10B981] font-medium hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read full article →
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Newsletter subscription */}
        <div className="mt-12 pt-12 border-t border-gray-200">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-[#1E3A8A] mb-4">Never Miss an Update</h3>
            <p className="text-gray-600 mb-6">Subscribe to our startup news digest delivered weekly to your inbox</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                required
              />
              <button
                type="submit"
                className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <FooterContent />
    </div>
    
  );
}

// Fallback sample data in case API fetch fails
const sampleNewsData: NewsItem[] = [
  {
    id: 1,
    title: "Sri Lanka Launches $20M Startup Innovation Fund",
    summary: "New government initiative aims to boost tech entrepreneurship with seed funding and mentorship.",
    source: "Tech Daily",
    date: "2025-04-10",
    url: "#",
    image: "/images/resources/innovation-fund.jpg",
    category: "Funding"
  },
  {
    id: 2,
    title: "Local Fintech Raises $5M Series A Round",
    summary: "PayEasy secures major investment to expand digital payment solutions across South Asia.",
    source: "Startup Journal",
    date: "2025-04-05",
    url: "#",
    image: "/images/resources/fintech-news.jpg",
    category: "Funding"
  },
  {
    id: 3,
    title: "Colombo Tech Hub Opening Accelerates Startup Growth",
    summary: "New co-working and innovation center in Colombo attracts 50+ startups in first month.",
    source: "Business Insider",
    date: "2025-03-28",
    url: "#",
    image: "/images/resources/tech-hub.jpg",
    category: "Ecosystem"
  },
  {
    id: 4,
    title: "E-commerce Adoption Jumps 40% in Sri Lanka",
    summary: "Post-pandemic shift creates opportunities for digital retail and logistics startups.",
    source: "Digital Economy Report",
    date: "2025-03-20",
    url: "#",
    image: "/images/resources/ecommerce.jpg",
    category: "Market Trends"
  }
];