"use client";
import React, { useEffect, useState } from "react";

// Define the type for a vendor
type Vendor = {
  service_name: string;
  email: string;
  type: string;
  expertise_in: string;
};

const PendingVendorsPage = () => {
  const [pendingVendors, setPendingVendors] = useState<Vendor[]>([]); // Apply the type here

  useEffect(() => {
    const fetchPendingVendors = async () => {
      try {
        const response = await fetch("/api/vendor?status=pending");
        const data = await response.json();
        setPendingVendors(data);
      } catch (error) {
        console.error("Failed to fetch pending vendors:", error);
      }
    };

    fetchPendingVendors();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Pending Vendor Applications</h1>
      <ul className="space-y-4">
        {pendingVendors.map((vendor, i) => (
          <li key={i} className="p-4 bg-white shadow-md rounded-lg border">
            <p><strong>Service:</strong> {vendor.service_name}</p>
            <p><strong>Email:</strong> {vendor.email}</p>
            <p><strong>Type:</strong> {vendor.type}</p>
            <p><strong>Expertise:</strong> {vendor.expertise_in}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingVendorsPage;