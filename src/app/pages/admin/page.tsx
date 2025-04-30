"use client";

import { useState, useEffect, ReactNode } from "react";
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
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usergroup, setUsergroup] = useState<string | null>(null);
  const [serviceStatusFilter, setServiceStatusFilter] = useState<
    "all" | "approved" | "rejected" | "pending"
  >("all");

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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-[#1E3A8A] to-[#10B981] text-white pt-32 pb-40 shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <nav className="mt-6">
          <div
            className={`px-6 py-3 cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-[#10B981] font-semibold"
                : "hover:bg-blue-800"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </div>
          <div
            className={`px-6 py-3 cursor-pointer ${
              activeTab === "users"
                ? "bg-[#10B981] font-semibold"
                : "hover:bg-blue-800"
            }`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </div>
          <div
            className={`px-6 py-3 cursor-pointer ${
              activeTab === "services"
                ? "bg-[#10B981] font-semibold"
                : "hover:bg-blue-800"
            }`}
            onClick={() => setActiveTab("services")}
          >
            Services
          </div>
          <div
            className={`px-6 py-3 cursor-pointer ${
              activeTab === "bookings"
                ? "bg-[#10B981] font-semibold"
                : "hover:bg-blue-800"
            }`}
            onClick={() => setActiveTab("bookings")}
          >
            Bookings
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
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
            <h2 className="text-3xl font-bold text-[#1E3A8A]">
              Dashboard Overview
            </h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-black">Total Users</h3>
                <p className="text-3xl font-bold text-[#1E3A8A]">
                  {stats.totalUsers}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-black">
                  Total Services
                </h3>
                <p className="text-3xl font-bold text-[#1E3A8A]">
                  {stats.totalServices}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-black">
                  Total Bookings
                </h3>
                <p className="text-3xl font-bold text-[#1E3A8A]">
                  {stats.totalBookings}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-black">
                  Total Revenue
                </h3>
                {/* <p className="text-3xl font-bold text-[#10B981]">${stats.totalRevenue.toLocaleString()}</p>
                 */}
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Monthly Activity
                </h3>
                <div className="h-80">
                  <Line
                    data={{
                      labels: stats.serviceDistribution.labels,
                      datasets: [
                        {
                          label: "Users",
                          data: stats.monthlyData.users,
                          borderColor: "#1E3A8A",
                          backgroundColor: "rgba(30, 58, 138, 0.1)",
                          tension: 0.3,
                        },
                        {
                          label: "Bookings",
                          data: stats.monthlyData.bookings,
                          borderColor: "#10B981",
                          backgroundColor: "rgba(16, 185, 129, 0.1)",
                          tension: 0.3,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Service Distribution
                </h3>
                <div className="h-80 flex justify-center items-center">
                  <Pie
                    data={{
                      labels: stats?.serviceDistribution?.labels || [],
                      datasets: [
                        {
                          data: stats?.serviceDistribution?.data || [],
                          backgroundColor: [
                            "#1E3A8A",
                            "#10B981",
                            "#F59E0B",
                            "#EF4444",
                            "#8B5CF6",
                          ],
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
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
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Recent Bookings
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.recentBookings && stats.recentBookings.length > 0
                      ? stats.recentBookings.map((booking) => (
                          <tr key={booking.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">
                                {booking.name || booking.Requstedservice}
                              </div>
                              <div className="text-sm text-black">
                                {booking.email || booking.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {booking.Requstedservice ||
                                  booking.Requstedservice}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {new Date(
                                  booking.request_date || booking.request_date
                                ).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  booking.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : booking.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : booking.status === "confirmed"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                onClick={() => viewBookingDetails(booking)}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      : null}

                    {(!stats.recentBookings ||
                      stats.recentBookings.length === 0) && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-4 text-center text-black"
                        >
                          No recent bookings available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#1E3A8A]">
              User Management
            </h2>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {user.username}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-black">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.typegroup === "Admin"
                                ? "bg-purple-100 text-purple-800"
                                : user.typegroup === "vendor"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.typegroup}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                            View
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Delete
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

        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-[#1E3A8A]">
                Service Management
              </h2>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services
                .filter(
                  (service) =>
                    serviceStatusFilter === "all" ||
                    service.status === serviceStatusFilter
                )
                .map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-[#1E3A8A] mb-2">
                        {service.name}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          service.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : service.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {service.status}
                      </span>
                      <p className="mt-4 text-gray-600">
                        {service.expertise_in}
                      </p>
                      <p className="mt-2 text-sm text-black">
                        <span className="font-medium">Year of Excellence:</span>{" "}
                        {service.years_of_excellence}
                      </p>

                      <div className="mt-6 flex space-x-4">
                        <button
                          onClick={() => viewServiceDetails(service)}
                          className="px-2 py-1 text-sm bg-[#1E3A8A] text-white rounded-md hover:bg-blue-800 transition-colors"
                        >
                          View Details
                        </button>

                        {service.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleServiceStatusChange(
                                  service.id,
                                  "approved"
                                )
                              }
                              className="px-2 py-1 text-sm bg-[#10B981] text-white rounded-md hover:bg-green-600 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleServiceStatusChange(
                                  service.id,
                                  "rejected"
                                )
                              }
                              className="px-2 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#1E3A8A]">
              Booking Management
            </h2>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {booking.name}
                          </div>
                          <div className="text-sm text-black">
                            {booking.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {booking.Requstedservice}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(
                              booking.request_date
                            ).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              booking.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : booking.status === "confirmed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                            onClick={() => viewBookingDetails(booking)}
                          >
                            View
                          </button>

                          {booking.status === "pending" && (
                            <button
                              className="text-green-600 hover:text-green-900 mr-3"
                              onClick={() =>
                                handleBookingStatusChange(
                                  booking.id,
                                  "confirmed"
                                )
                              }
                            >
                              Confirm
                            </button>
                          )}

                          {(booking.status === "pending" ||
                            booking.status === "confirmed") && (
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() =>
                                handleBookingStatusChange(
                                  booking.id,
                                  "cancelled"
                                )
                              }
                            >
                              Cancel
                            </button>
                          )}

                          {booking.status === "confirmed" && (
                            <button
                              className="text-green-600 hover:text-green-900 mr-3"
                              onClick={() =>
                                handleBookingStatusChange(
                                  booking.id,
                                  "completed"
                                )
                              }
                            >
                              Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
              <div className="px-6 py-4 bg-[#1E3A8A] text-white flex justify-between items-center">
                <h3 className="text-xl font-semibold">Booking Details</h3>
                <button
                  className="text-white text-2xl font-bold"
                  onClick={() => {
                    setShowBookingModal(false);
                    setSelectedBooking(null);
                  }}
                >
                  &times;
                </button>
              </div>

              <div className="bg-white shadow-md rounded-xl border border-gray-200 p-6  mx-auto">
                <h4 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-4">
                  User Information
                </h4>
                <div className="grid grid-cols-2 gap-y-4 text-sm text-gray-700">
                  <div className="font-medium text-gray-900">Name:</div>
                  <div>{selectedBooking.name}</div>

                  <div className="font-medium text-gray-900">Email:</div>
                  <div>{selectedBooking.email}</div>

                  <div className="font-medium text-gray-900">Service:</div>
                  <div>{selectedBooking.Requstedservice}</div>

                  <div className="font-medium text-gray-900">Date:</div>
                  <div>
                    {new Date(
                      selectedBooking.request_date
                    ).toLocaleDateString()}
                  </div>

                  <div className="font-medium text-gray-900">Status:</div>
                  <div>{selectedBooking.status}</div>

                  <div className="font-medium text-gray-900">Message:</div>
                  <div>{selectedBooking.what_you_need}</div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Service Modal */}
        {showServiceModal && selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
              <div className="px-6 py-4 bg-[#1E3A8A] text-white flex justify-between items-center">
                <h3 className="text-xl font-semibold">Service Details</h3>
                <button
                  className="text-white text-2xl font-bold"
                  onClick={() => {
                    setShowServiceModal(false);
                    setSelectedService(null);
                  }}
                >
                  &times;
                </button>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-[#1E3A8A] mb-3">
                    Service Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-black">Name</p>
                      <p className="font-medium text-blue-800">
                        {selectedService.service_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-black">Type</p>
                      <p className="font-medium text-blue-800">
                        {selectedService.type}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-black">Status</p>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedService.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : selectedService.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedService.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-black">Years of Excellence</p>
                      <p className="font-medium text-blue-800">
                        {selectedService.years_of_excellence}
                      </p>
                    </div>
                    {selectedService.email && (
                      <div>
                        <p className="text-sm text-black">Email</p>
                        <p className="font-medium text-blue-800">
                          {selectedService.email}
                        </p>
                      </div>
                    )}
                    {selectedService.contact_number && (
                      <div>
                        <p className="text-sm text-black">Contact Number</p>
                        <p className="font-medium text-blue-800">
                          {selectedService.contact_number}
                        </p>
                      </div>
                    )}
                    {selectedService.address && (
                      <div>
                        <p className="text-sm text-black">Address</p>
                        <p className="font-medium text-blue-800">
                          {selectedService.address}
                        </p>
                      </div>
                    )}
                    {selectedService.expertise_in && (
                      <div>
                        <p className="text-sm text-black">Expertise In</p>
                        <p className="font-medium text-blue-800">
                          {selectedService.expertise_in}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-black">Selected services</p>
                    <p className="mt-1 text-blue-800">
                      {selectedService.selected_services}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  {selectedService.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleServiceStatusChange(
                            selectedService.id,
                            "approved"
                          )
                        }
                        className="px-2 py-1 text-sm bg-[#10B981] text-white rounded-md hover:bg-green-600 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleServiceStatusChange(
                            selectedService.id,
                            "rejected"
                          )
                        }
                        className="px-2 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    className="px-2 py-1 text-sm bg-[#1E3A8A] text-white rounded-md hover:bg-blue-800 transition-colors"
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
}
