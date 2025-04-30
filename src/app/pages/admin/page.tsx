"use client";

import { useState, useEffect, ReactNode, SetStateAction } from "react";
import { FaBriefcase, FaSignOutAlt as LogOut, FaBell as Bell, FaChevronDown as ChevronDown, FaSearch, FaDollarSign, FaUsers, FaCalendar, FaUser, FaTimes, FaClock, FaEnvelope, FaCheck, FaPhone, FaMapMarkerAlt, FaTablet } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { useRouter } from "next/navigation";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import MonthlyStatsBarChart from "@/app/components/BarChart/MonthlyStatsBarChart";
import Home from "@/app/page";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

type User = {
  request_date: any;
  Requstedservice: ReactNode;
  status: string;
  typegroup: string;
  username: ReactNode;
  id: string;
  name: string;
  email: string;
  type: string;
  createdAt: Date;
};

type Props = {
  data: {
    labels: string[];
    users: number[];
    bookings: number[];
    revenue?: number[];
  };
};

type Service = {
  selected_services: ReactNode;
  service_name: string;
  id: string;
  name: string;
  type: string;
  description: string;
  selectedservice: string;
  years_of_excellence: string;
  status: "approved" | "rejected" | "pending";
  image?: string;
  email?: string;
  contact_number?: string;
  address?: string;
  expertise_in?: string;
};

type Booking = {
  what_you_need: ReactNode;
  committed: ReactNode;
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  serviceId: string;
  serviceName: string;
  date: Date;
  message: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
  request_date: string | number | Date;
  Requstedservice: string;
  email?: React.ReactNode;
  name?: React.ReactNode;
};

type DashboardStats = {
  data: number[];
  bookings: number[];
  users: number[];
  labels: string[];
  totalUsers: number;
  totalServices: number;
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
  recentBookings: Booking[];
  monthlyData: {
    data: unknown;
    labels: string[];
    users: number[];
    bookings: number[];
    revenue: number[];
  };
  serviceDistribution: {
    labels: string[];
    data: number[];
  };
};

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "users" | "services" | "bookings"
  >("dashboard");
  const [users, setUsers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const email = localStorage.getItem("email") || "";
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usergroup, setUsergroup] = useState<string | null>(null);
  const [userFilterGroup, setUserFilterGroup] = useState("Admin");
  const [serviceStatusFilter, setServiceStatusFilter] = useState<
    "all" | "approved" | "rejected" | "pending"
  >("all");

  const [bookingStatusFilter, setBookingStatusFilter] = useState<
     ""| "pending" | "confirmed" | "completed" | "cancelled"
  >("");

   
  const filteredServices = services.filter(
    (service) =>
      serviceStatusFilter === "all" || service.status === serviceStatusFilter
  );

  const filteredBookings = bookings.filter(
    (booking) =>
      bookingStatusFilter === "" || booking.status === bookingStatusFilter
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); 

  // Modal states
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    const group = localStorage.getItem("typegroup");
    
    setUsergroup(group);
  }, []);



  useEffect(() => {
    if (usergroup === "Admin") {
      fetchDashboardData();
    } else if (usergroup && usergroup !== "Admin") {
      router.push("/");
    }
  }, [usergroup, router]);

  const fetchData = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch data from " + url);
    }
    return await response.json();
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const usersData = await fetchData("/api/admin/users");
      const servicesData = await fetchData("/api/admin/services");
      const bookingsData = await fetchData("/api/admin/bookings");
      const statsData = await fetchData("/api/admin/stats");

      setUsers(usersData);
      setServices(servicesData);
      setBookings(bookingsData);
      setStats(statsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleServiceStatusChange = async (
    serviceId: string,
    newStatus: "approved" | "rejected"
  ) => {
    try {
      const response = await fetch("/api/admin/updateServiceStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to update service status");

      // Optimistically update the local state
      setServices((prevServices) =>
        prevServices.map((service) =>
          service.id === serviceId ? { ...service, status: newStatus } : service
        )
      );

      // Close modal if open
      setShowServiceModal(false);
      setSelectedService(null);

      // Refresh stats
      const statsResponse = await fetch("/api/admin/stats");
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update service status"
      );
    }
  };

  const handleBookingStatusChange = async (
    bookingId: string,
    newStatus: "confirmed" | "completed" | "cancelled"
  ) => {
    try {
      const response = await fetch("/api/admin/updateBookingStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to update booking status");

      // Optimistically update local state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );

      // Close modal if open
      setShowBookingModal(false);
      setSelectedBooking(null);

      // Refresh stats
      const statsResponse = await fetch("/api/admin/stats");
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update booking status"
      );
    }
  };

  const viewBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };

  const viewServiceDetails = (service: Service) => {
    setSelectedService(service);
    setShowServiceModal(true);
  };

  const data = {
    labels: [
      "Nov 2024",
      "Dec 2024",
      "Jan 2025",
      "Feb 2025",
      "Mar 2025",
      "Apr 2025",
    ],
    users: [12, 15, 20, 18, 25, 22],
    bookings: [30, 40, 35, 50, 45, 55],
    revenue: [500, 700, 900, 1200, 1000, 1100],
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#1E6F9F]"></div>
      </div>
    );

    const handleFilterChange = (filter: SetStateAction<string>) => {
      setUserFilterGroup(filter);
    };

 
  return (
    <div className="flex h-screen bg-gray-50 ">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-gradient-to-b from-[#1E3A8A] to-[#10B981] text-white shadow-lg z-10`}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center justify-center">
            <h1 className={`text-xl font-bold text-white ${!sidebarOpen && 'hidden'}`}>Service Admin</h1>
            {!sidebarOpen && <span className="text-white text-2xl">🏠</span>}
          </div>

          <div className="px-4 mb-8">
            <div className={`w-full h-0.5 bg-gray-100 ${!sidebarOpen && 'hidden'}`}></div>
          </div>

          <nav className="flex-grow">
            <div
              className={`px-6 py-4 cursor-pointer flex items-center ${activeTab === "dashboard" ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <MdDashboard size={20} className="text-black"/>
              <span className={`ml-3 text-black ${!sidebarOpen && 'hidden'} `}>Dashboard</span>
            </div>

            <div
              className={`px-6 py-4 cursor-pointer flex items-center ${activeTab === "users" ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
              onClick={() => setActiveTab("users")}
            >
              <FaUsers size={20}className="text-black " />
              <span className={`ml-3 text-black ${!sidebarOpen && 'hidden'}`}>Users</span>
            </div>

            <div
              className={`px-6 py-4 cursor-pointer flex items-center ${activeTab === "services" ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
              onClick={() => setActiveTab("services")}
            >
              <FaBriefcase size={20} className="text-black"/>
              <span className={`ml-3 text-black ${!sidebarOpen && 'hidden'}`}>Services</span>
            </div>

            <div
              className={`px-6 py-4 cursor-pointer flex items-center ${activeTab === "bookings" ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
              onClick={() => setActiveTab("bookings")}
            >
              <FaCalendar size={20} className="text-black"/>
              <span className={`ml-3 text-black ${!sidebarOpen && 'hidden'}`}>Bookings</span>
            </div>
          </nav>

          <div className="p-6">
            <div className={`w-full h-0.5 bg-gray-100 mb-6 ${!sidebarOpen && 'hidden'}`}></div>
            <div className="flex items-center cursor-pointer text-gray-600 hover:text-red-500">
              <LogOut size={20} className="text-black" />
              <span className={`ml-3 text-black ${!sidebarOpen && 'hidden'}`}>Logout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}

      <div className="flex-1 overflow-y-auto p-8">
        <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="relative flex-1 max-w-lg mx-8">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center">
            <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 relative mr-4">
              <Bell size={20} />
              
                {stats && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">{stats.pendingBookings}</span>
                )}
              
            </button>
            <div className="relative"  onClick={() => setIsOpen(!isOpen)}>
              <div className="flex items-center cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">{localStorage.getItem("email")?.charAt(0).toUpperCase()}</div>
                <span className="ml-2 mr-1 font-medium text-gray-700"></span>
                <ChevronDown size={16} className="text-gray-500" />
              </div>
            </div>
            {isOpen && (
  <div className="absolute mt-2 right-0 bg-white border rounded-md shadow-lg py-2 px-4 text-sm text-gray-800 z-10">
    <div className="flex justify-between items-center">
      <span>{email}</span>
      <button
        onClick={() => setIsOpen(false)}
        className="ml-4 text-red-500 font-bold hover:text-red-700"
      >
        X
      </button>
    </div>
  </div>
)}

          </div>
        </header>
        {/* Error Alert */}
        {error && (
          <div
            className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError(null)}
            >
              <span className="text-xl">&times;</span>
            </button>
          </div>
        )}

        {activeTab === "dashboard" && stats && (
          <div className="space-y-8">


            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalUsers}</h3>
                    <p className="text-xs text-green-500 mt-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      12% from last month
                    </p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-full">
                    <FaUsers className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Services</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalServices}</h3>
                    <p className="text-xs text-green-500 mt-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      8% from last month
                    </p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-full">
                    <FaBriefcase className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalBookings}</h3>
                    <p className="text-xs text-green-500 mt-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      15% from last month
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-full">
                    <FaCalendar className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">${stats.totalRevenue.toLocaleString()}</h3>
                    <p className="text-xs text-red-500 mt-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      3% from last month
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-full">
                    <FaDollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Monthly Activity</h3>
                  <div className="flex items-center space-x-2">
                    <span className="h-3 w-3 bg-blue-500 rounded-full"></span>
                    <span className="text-xs text-gray-500 mr-4">Users</span>
                    <span className="h-3 w-3 bg-green-500 rounded-full"></span>
                    <span className="text-xs text-gray-500">Bookings</span>
                  </div>
                </div>
                <div className="h-72">
                  <Line
                    data={{
                      labels: stats.monthlyData.labels,
                      datasets: [
                        {
                          label: "Users",
                          data: stats.monthlyData.users,
                          borderColor: "rgba(59, 130, 246, 1)",
                          backgroundColor: "rgba(59, 130, 246, 0.1)",
                          tension: 0.4,
                          borderWidth: 2,
                          pointBackgroundColor: "white",
                          pointBorderColor: "rgba(59, 130, 246, 1)",
                          pointBorderWidth: 2,
                          pointRadius: 4,
                          pointHoverRadius: 6,
                        },
                        {
                          label: "Bookings",
                          data: stats.monthlyData.bookings,
                          borderColor: "rgba(16, 185, 129, 1)",
                          backgroundColor: "rgba(16, 185, 129, 0.1)",
                          tension: 0.4,
                          borderWidth: 2,
                          pointBackgroundColor: "white",
                          pointBorderColor: "rgba(16, 185, 129, 1)",
                          pointBorderWidth: 2,
                          pointRadius: 4,
                          pointHoverRadius: 6,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          mode: 'index',
                          intersect: false,
                          backgroundColor: "rgba(17, 24, 39, 0.8)",
                          padding: 12,
                          cornerRadius: 6,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {

                            color: "rgba(229, 231, 235, 0.5)",
                          },
                          ticks: {
                            font: {
                              size: 10,
                            },
                          },
                        },
                        x: {
                          grid: {
                            display: false,
                          },
                          ticks: {
                            font: {
                              size: 10,
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Service Distribution</h3>
                <div className="h-72 flex justify-center items-center">
                  <Pie
                    data={{
                      labels: stats.serviceDistribution.labels,
                      datasets: [
                        {
                          data: stats.serviceDistribution.data,
                          backgroundColor: [
                            "rgba(59, 130, 246, 0.8)",
                            "rgba(16, 185, 129, 0.8)",
                            "rgba(249, 115, 22, 0.8)",
                            "rgba(139, 92, 246, 0.8)",
                            "rgba(236, 72, 153, 0.8)",
                          ],
                          borderColor: "white",
                          borderWidth: 2,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                          labels: {
                            boxWidth: 12,
                            padding: 20,
                            font: {
                              size: 11,
                            },
                          },
                        },
                        tooltip: {
                          backgroundColor: "rgba(17, 24, 39, 0.8)",
                          padding: 12,
                          cornerRadius: 6,
                          callbacks: {
                            label: function (context) {
                              const total = context.dataset.data.reduce((a, b) => a + b, 0);
                              const percentage = Math.round(((context.raw as number) / total) * 100);
                              return `${context.label}: ${percentage}% (${context.raw})`;
                            }
                          }
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>


            <div>
              <h2 className="text-xl font-semibold mb-4">Monthly Statistics</h2>
              <MonthlyStatsBarChart data={data} />
            </div>

            {/* Recent Bookings */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Recent Bookings</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.recentBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                              <span className="text-gray-600 font-medium">{(booking.name ?? "").toString().charAt(0)}</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                              <div className="text-sm text-gray-500">{booking.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.Requstedservice}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.request_date.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                  booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'}`}
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => viewBookingDetails(booking)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}



        {activeTab === "users" && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
                
              <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => handleFilterChange("")}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  userFilterGroup === ""
                    ? "bg-[#1E3A8A] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } border border-gray-300`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => handleFilterChange("client")}
                className={`px-4 py-2 text-sm font-medium ${
                  userFilterGroup === "client"
                    ? "bg-[#10B981] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } border-t border-b border-gray-300`}
              >
                Regular Users 
              </button>
                <button
                type="button"
                onClick={() => handleFilterChange("vendor")}
                className={`px-4 py-2 text-sm font-medium ${
                  userFilterGroup === "vendor"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } border-t border-b border-gray-300`}
              >
                Vendors
              </button>
                <button
                type="button"
                onClick={() => handleFilterChange("Admin")}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  userFilterGroup === "Admin"
                    ? "bg-yellow-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } border border-gray-300`}
              >
                Administrators
              </button>

               
            </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-700">Users List</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name & Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users
                      .filter((user) => (!userFilterGroup ? true : user.typegroup === userFilterGroup))
                      .map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 mr-3">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-600 font-medium">{typeof user.username === "string" ? user.username.charAt(0) : "?"}</span>
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${user.typegroup === 'Admin' ? 'bg-red-100 text-red-800' :
                                user.typegroup === 'vendor' ? 'bg-blue-100 text-blue-800' :
                                  'bg-green-100 text-green-800'}`}>
                              {user.typegroup}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {/* {user.createdAt.toLocaleDateString()} */}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                            <button className="text-red-600 hover:text-red-900">Delete</button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">{FileReader.length}</span> of{' '}
                      <span className="font-medium">{users.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                        1
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


        {activeTab === "services" && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Services Management</h1>
              <div className="inline-flex rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={() => setServiceStatusFilter("all")}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                    serviceStatusFilter === "all"
                      ? "bg-[#1E3A8A] text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  } border border-gray-300`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setServiceStatusFilter("approved")}
                  className={`px-4 py-2 text-sm font-medium  ${
                    serviceStatusFilter === "approved"
                      ? "bg-[#10B981] text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  } border-t border-b border-gray-300`}
                >
                  Approved 
                </button>
                <button
                  type="button"
                  onClick={() => setServiceStatusFilter("rejected")}
                  className={`px-4 py-2 text-sm font-medium ${
                    serviceStatusFilter === "rejected"
                      ? "bg-red-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  } border-t border-b border-gray-300 `}
                >
                  Rejected
                </button>
                <button
                  type="button"
                  onClick={() => setServiceStatusFilter("pending")}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                    serviceStatusFilter === "pending"
                      ? "bg-yellow-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  } border border-gray-300`}
                >
                  Pending
                </button>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-700">Services List</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service Info
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredServices
                      .filter((service) => serviceStatusFilter === "all" || service.status === serviceStatusFilter)
                      .map((service) => (
                        <tr key={service.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center mr-3">
                                <FaBriefcase className="h-5 w-5 text-gray-500" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{service.service_name}</div>
                                <div className="text-sm text-gray-500">{service.expertise_in}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{service.type}</div>
                            <div className="text-sm text-gray-500">{service.years_of_excellence} years experience</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{service.email}</div>
                            <div className="text-sm text-gray-500">{service.contact_number}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${service.status === 'approved' ? 'bg-green-100 text-green-800' :
                                service.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'}`}>
                              {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              className="text-blue-600 hover:text-blue-900 mr-3"
                              onClick={() => viewServiceDetails(service)}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredServices.length}</span> of{' '}
                      <span className="font-medium">{services.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                        1
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Bookings Content */}
        {activeTab === "bookings" && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Bookings Management</h1>
              <div className="flex items-center space-x-3">
                
              <div className="inline-flex rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={() => setBookingStatusFilter("")}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                    bookingStatusFilter === ""
                      ? "bg-[#1E3A8A] text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  } border border-gray-300`}
                >
                  All  
                </button>
                <button
                  type="button"
                  onClick={() => setBookingStatusFilter("completed")}
                  className={`px-4 py-2 text-sm font-medium  ${
                    bookingStatusFilter === "completed"
                      ? "bg-[#10B981] text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  } border-t border-b border-gray-300`}
                >
                  completed
                </button>
                <button
                  type="button"
                  onClick={() => setBookingStatusFilter("cancelled")}
                  className={`px-4 py-2 text-sm font-medium ${
                    bookingStatusFilter === "cancelled"
                      ? "bg-red-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  } border-t border-b border-gray-300 `}
                >
                  cancelled
                </button>
                <button
                  type="button"
                  onClick={() => setBookingStatusFilter("pending")}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                    bookingStatusFilter === "pending"
                      ? "bg-yellow-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  } border border-gray-300`}
                >
                  Pending
                </button>
               
              </div>

                
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-700">Bookings List</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer Info
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Request Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {bookings
                      .filter((booking) => (!bookingStatusFilter ? true : booking.status === bookingStatusFilter))
                      .map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 mr-3">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-600 font-medium">{typeof booking.name === "string" ? booking.name.charAt(0) : "?"}</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                              <div className="text-sm text-gray-500">{booking.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.Requstedservice}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.request_date.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                  booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'}`}
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => viewBookingDetails(booking)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">{bookings.length}</span> of{' '}
                      <span className="font-medium">{bookings.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                        1
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

     
      {/* Booking Modal */}
      {showBookingModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-fadeIn">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-800 to-blue-600 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <FaCalendar size={20} />
                <h3 className="text-xl font-semibold">Booking Details</h3>
              </div>
              <button
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
                onClick={() => setShowBookingModal(false)}
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 rounded-lg p-4 flex items-center space-x-3 border-l-4 border-blue-500">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaUser size={24} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-800">{selectedBooking.name}</h4>
                  <p className="text-sm text-blue-600 flex items-center">
                    <FaEnvelope size={14} className="mr-1" /> {selectedBooking.email}
                  </p>
                </div>
                <div className="ml-auto">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    selectedBooking.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-500 mb-1">Requested Service</h5>
                    <p className="text-gray-800 font-medium flex items-center">
                      <FaBriefcase size={16} className="mr-2 text-blue-600" />
                      {selectedBooking.Requstedservice}
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-500 mb-1">Date Requested</h5>
                    <p className="text-gray-800 font-medium flex items-center">
                      <FaClock size={16} className="mr-2 text-blue-600" />
                      {new Date(selectedBooking.request_date).toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-500 mb-1">Client Message</h5>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-gray-700 text-sm h-24 overflow-y-auto">
                    {selectedBooking.what_you_need}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                {(selectedBooking.status === 'pending' || selectedBooking.status === 'confirmed') && (
                  <>
                    <button className="px-4 py-2 text-sm bg-yellow-400 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center shadow-sm"
                    onClick={() => handleBookingStatusChange(selectedBooking.id, 'confirmed')} >
                    
                      <FaTablet size={16} className="mr-1"  />
                      Confirmed
                    </button>

                    <button className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center shadow-sm"
                    onClick={() => handleBookingStatusChange(selectedBooking.id, 'completed')} >
                    
                      <FaCheck size={16} className="mr-1"  />
                      Completed
                    </button>

                    <button className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center shadow-sm"
                    onClick={() => handleBookingStatusChange(selectedBooking.id, 'cancelled')} >
                      <FaTimes size={16} className="mr-1" />
                      Reject
                    </button>   
                  </>
                )}
                <button
                  className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setShowBookingModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Service Modal */}
      {showServiceModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-fadeIn">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-800 to-blue-600 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <FaBriefcase size={20} />
                <h3 className="text-xl font-semibold">Service Details</h3>
              </div>
              <button
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
                onClick={() => setShowServiceModal(false)}
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{selectedService.service_name}</h4>
                  <p className="text-sm text-gray-600">{selectedService.type}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  selectedService.status === 'approved' ? 'bg-green-100 text-green-800' :
                  selectedService.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedService.status.charAt(0).toUpperCase() + selectedService.status.slice(1)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-500">Contact Information</h5>
                    <ul className="mt-2 space-y-2">
                      <li className="flex items-start">
                        <FaEnvelope size={16} className="mt-1 mr-2 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-800">{selectedService.email}</span>
                      </li>
                      <li className="flex items-start">
                        <FaPhone size={16} className="mt-1 mr-2 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-800">{selectedService.contact_number}</span>
                      </li>
                      <li className="flex items-start">
                        <FaMapMarkerAlt size={16} className="mt-1 mr-2 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-800">{selectedService.address}</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-500">Service Information</h5>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                          <FaClock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Years of Excellence</p>
                          <p className="font-medium">{selectedService.years_of_excellence}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h6 className="text-xs text-gray-500 mt-3 mb-1">Expertise In</h6>
                        <p className="text-sm text-gray-800">{selectedService.expertise_in}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-500 mb-2">Selected Services</h5>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <ul className="space-y-1">
                    {typeof selectedService.selected_services === 'string' 
                      ? selectedService.selected_services.split(', ').map((service, index) => (
                          <li key={index} className="flex items-center text-gray-700">
                            <FaCheck size={16} className="mr-2 text-green-500" />
                            {service}
                          </li>
                        ))
                      : null}
                  
     
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                {selectedService.status === 'pending' && (
                  <>
                    <button 
                      className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center shadow-sm"
                      onClick={() => handleServiceStatusChange(selectedService.id, 'approved')} 
                    >
                      <FaCheck size={16} className="mr-1" />
                      Approve
                    </button>
                    <button 
                      className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center shadow-sm"
                      onClick={() => handleServiceStatusChange(selectedService.id, 'rejected')}
                    >
                      <FaTimes size={16} className="mr-1" />
                      Reject
                    </button>
                  </>
                )}
                <button
                  className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setShowServiceModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
   
   
  );
};