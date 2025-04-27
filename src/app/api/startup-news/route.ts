// src/app/api/startup-news/route.ts
import { NextResponse } from 'next/server';

// Define the news item structure
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

// This is where you would connect to your database or external API
// For now, we'll use sample data
const newsData: NewsItem[] = [
  {
    id: 1,
    title: "Sri Lanka Launches $20M Startup Innovation Fund",
    summary: "New government initiative aims to boost tech entrepreneurship with seed funding and mentorship.",
    source: "Tech Daily",
    date: "2025-04-10",
    url: "https://example.com/article1",
    image: "/images/resources/innovation-fund.jpg",
    category: "Funding"
  },
  {
    id: 2,
    title: "Local Fintech Raises $5M Series A Round",
    summary: "PayEasy secures major investment to expand digital payment solutions across South Asia.",
    source: "Startup Journal",
    date: "2025-04-05",
    url: "https://example.com/article2",
    image: "/images/resources/fintech-news.jpg",
    category: "Funding"
  },
  {
    id: 3,
    title: "Colombo Tech Hub Opening Accelerates Startup Growth",
    summary: "New co-working and innovation center in Colombo attracts 50+ startups in first month.",
    source: "Business Insider",
    date: "2025-03-28",
    url: "https://example.com/article3",
    image: "/images/resources/tech-hub.jpg",
    category: "Ecosystem"
  },
  {
    id: 4,
    title: "E-commerce Adoption Jumps 40% in Sri Lanka",
    summary: "Post-pandemic shift creates opportunities for digital retail and logistics startups.",
    source: "Digital Economy Report",
    date: "2025-03-20",
    url: "https://example.com/article4",
    image: "/images/resources/ecommerce.jpg",
    category: "Market Trends"
  },
  {
    id: 5,
    title: "New Tax Benefits for Technology Startups Announced",
    summary: "Government introduces five-year tax exemptions for qualifying tech startups starting next quarter.",
    source: "Business Standard",
    date: "2025-04-15",
    url: "https://example.com/article5",
    image: "/images/resources/tax-benefits.jpg",
    category: "Policy"
  },
  {
    id: 6,
    title: "Local Startup Expands to Singapore Market",
    summary: "EduTech platform SecureLearn announces regional expansion after successful local operations.",
    source: "Asian Business Review",
    date: "2025-04-12",
    url: "https://example.com/article6",
    image: "/images/resources/expansion.jpg",
    category: "Growth"
  }
];

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Here you would typically:
    // 1. Fetch data from a database or external API
    // 2. Process the data as needed
    // 3. Return the formatted response
    
    return NextResponse.json(newsData);
  } catch (error) {
    console.error('Error in startup news API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch startup news' },
      { status: 500 }
    );
  }
}