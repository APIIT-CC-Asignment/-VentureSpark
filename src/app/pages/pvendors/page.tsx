"use client";
import React, { useEffect, useState } from "react";

type Vendor = {
  service_name: string;
  email: string;
  type: string;
  expertise_in: string;
};

const PendingVendorsPage = () => {
  const [pendingVendors, setPendingVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    const fetchPendingVendors = async () => {
      try {
        const response = await fetch("/api/vendor");
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API error: ${response.status}`, errorText);
          return;
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          console.error("API did not return an array:", data);
          return;
        }
        setPendingVendors(data);
      } catch (error) {
        console.error("Failed to fetch pending vendors:", error);
      }
    };

    fetchPendingVendors();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100">
      {/* Hero Section */}
      <div className="text-center py-20 bg-gradient-to-b from-blue-900 to-teal-500 text-white">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Pending Vendor Applications
        </h1>
        <p className="text-lg max-w-2xl mx-auto">
          Review the list of vendors waiting for approval and their specialties
          in delivering services to Sri Lankan startups.
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-8 py-12 max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md text-center py-6">
          <p className="text-3xl font-bold text-blue-900">3.5x</p>
          <p className="text-sm text-gray-600">Faster Growth with Mentorship</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md text-center py-6">
          <p className="text-3xl font-bold text-blue-900">80%</p>
          <p className="text-sm text-gray-600">Higher Success Rate</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md text-center py-6">
          <p className="text-3xl font-bold text-blue-900">500+</p>
          <p className="text-sm text-gray-600">Expert Mentors</p>
        </div>
      </div>

      {/* Vendor Cards */}
      <div className="px-8 pb-16 max-w-7xl mx-auto">
        {pendingVendors.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No pending vendors found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingVendors.map((vendor, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
              >
                <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 14l-4 4m0 0l-4-4m4 4V10" />
                  </svg>
                  {vendor.service_name}
                </h2>
                <p className="text-sm text-gray-700 flex items-center gap-2 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 2H5a2 2 0 00-2 2v16a2 2 0 002 2h11a2 2 0 002-2V8l-5-5z" />
                  </svg>
                  {vendor.email}
                </p>
                <p className="text-sm text-gray-700 flex items-center gap-2 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20l9-5-9-5-9 5 9 5zm0 0v-8" />
                  </svg>
                  Type: {vendor.type}
                </p>
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-purple-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h16M4 10h16M4 16h16" />
                  </svg>
                  Expertise: {vendor.expertise_in}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingVendorsPage;
