// "use client";
// import React, { useEffect, useState } from "react";

// type Vendor = {
//   service_name: string;
//   email: string;
//   type: string;
//   expertise_in: string;
// };

// const PendingVendorsPage = () => {
//   const [pendingVendors, setPendingVendors] = useState<Vendor[]>([]);

//   useEffect(() => {
//     const fetchPendingVendors = async () => {
//       try {
//         const response = await fetch("/api/vendor");
//         if (!response.ok) {
//           const errorText = await response.text();
//           console.error(`API error: ${response.status}`, errorText);
//           return;
//         }
//         const data = await response.json();
//         if (!Array.isArray(data)) {
//           console.error("API did not return an array:", data);
//           return;
//         }
//         setPendingVendors(data);
//       } catch (error) {
//         console.error("Failed to fetch pending vendors:", error);
//       }
//     };

//     fetchPendingVendors();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100">
//       {/* Hero Section */}
//       <div className="text-center py-20 bg-gradient-to-b from-blue-900 to-teal-500 text-white">
//         <h1 className="text-4xl sm:text-5xl font-bold mb-4">
//           Pending Vendor Applications
//         </h1>
//         <p className="text-lg max-w-2xl mx-auto">
//           Review the list of vendors waiting for approval and their specialties
//           in delivering services to Sri Lankan startups.
//         </p>
//       </div>

//       {/* Stats Summary */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-8 py-12 max-w-6xl mx-auto">
//         <div className="bg-white rounded-2xl shadow-md text-center py-6">
//           <p className="text-3xl font-bold text-blue-900">3.5x</p>
//           <p className="text-sm text-gray-600">Faster Growth with Mentorship</p>
//         </div>
//         <div className="bg-white rounded-2xl shadow-md text-center py-6">
//           <p className="text-3xl font-bold text-blue-900">80%</p>
//           <p className="text-sm text-gray-600">Higher Success Rate</p>
//         </div>
//         <div className="bg-white rounded-2xl shadow-md text-center py-6">
//           <p className="text-3xl font-bold text-blue-900">500+</p>
//           <p className="text-sm text-gray-600">Expert Mentors</p>
//         </div>
//       </div>

//       {/* Vendor Cards */}
//       <div className="px-8 pb-16 max-w-7xl mx-auto">
//         {pendingVendors.length === 0 ? (
//           <p className="text-center text-gray-500 text-lg">No pending vendors found.</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {pendingVendors.map((vendor, i) => (
//               <div
//                 key={i}
//                 className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
//               >
//                 <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="w-5 h-5 text-blue-500"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 14l-4 4m0 0l-4-4m4 4V10" />
//                   </svg>
//                   {vendor.service_name}
//                 </h2>
//                 <p className="text-sm text-gray-700 flex items-center gap-2 mb-2">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="w-4 h-4 text-blue-400"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 2H5a2 2 0 00-2 2v16a2 2 0 002 2h11a2 2 0 002-2V8l-5-5z" />
//                   </svg>
//                   {vendor.email}
//                 </p>
//                 <p className="text-sm text-gray-700 flex items-center gap-2 mb-2">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="w-4 h-4 text-green-500"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20l9-5-9-5-9 5 9 5zm0 0v-8" />
//                   </svg>
//                   Type: {vendor.type}
//                 </p>
//                 <p className="text-sm text-gray-700 flex items-center gap-2">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="w-4 h-4 text-purple-500"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h16M4 10h16M4 16h16" />
//                   </svg>
//                   Expertise: {vendor.expertise_in}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PendingVendorsPage;
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Vendor = {
  id: number;
  service_name: string;
  years_of_excellence: number;
  email: string;
  contact_number: string;
  address: string;
  selected_services: string;
  type: string;
  active: string;
  created_at: string;
  updated_at: string;
  expertise_in: string;
};

const PendingVendorsPage = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPendingVendors = async () => {
      try {
        const res = await fetch("/api/vendors");
  
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`API error: ${res.status} - ${errorText}`);
        }
  
        const text = await res.text();
        if (!text) {
          throw new Error("API returned empty response body");
        }
  
        const data = JSON.parse(text);
        setVendors(data);
      } catch (error) {
        console.error("Failed to fetch vendors:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPendingVendors();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: number,
    field: keyof Vendor
  ) => {
    const updated = vendors.map((vendor) =>
      vendor.id === id ? { ...vendor, [field]: e.target.value } : vendor
    );
    setVendors(updated);
  };

  const handleBackClick = () => {
    router.push("/");
  };

  const handleApprove = () => {
    // Implement approve functionality
    alert("Vendors approved!");
  };

  const handleReject = () => {
    // Implement reject functionality
    alert("Vendors rejected!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Blue gradient to match admin */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-blue-700 to-teal-600 px-6 py-4 flex justify-between items-center shadow-md">
        <img src="/Venture Spark Logo" alt="Venture Spark Logo" className="h-6 text-white" />
        <nav className="hidden md:flex gap-6 font-medium text-white">
          <a href="#" className="hover:text-gray-200 transition">Home</a>
          <a href="#" className="hover:text-gray-200 transition">About</a>
          <a href="#" className="hover:text-gray-200 transition">Services</a>
          <a href="#" className="hover:text-gray-200 transition">Contact</a>
          <a href="#" className="hover:text-gray-200 transition">Registration</a>
        </nav>
        <div className="flex items-center gap-3">
          <h1 className="text-white font-medium">Venture Spark Admin</h1>
          <div className="w-8 h-8 rounded-full bg-white" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={handleBackClick}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
          >
            &larr; Back to Dashboard
          </button>
          <h2 className="text-3xl font-bold text-green-400 text-center">
            Pending Vendor Applications
          </h2>
          <div className="w-24"></div> {/* Empty div for balanced layout */}
        </div>

        {loading ? (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <p className="text-gray-900 text-xl">Loading vendors...</p>
          </div>
        ) : vendors.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <p className="text-gray-500 text-xl">No pending vendors found.</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100 text-blue-800 font-semibold">
                    <tr>
                      <th className="p-3 text-left">Service Name</th>
                      <th className="p-3 text-left">Years</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Contact</th>
                      <th className="p-3 text-left">Address</th>
                      <th className="p-3 text-left">Selected Services</th>
                      <th className="p-3 text-left">Type</th>
                      <th className="p-3 text-left">Active</th>
                      <th className="p-3 text-left">Expertise In</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.map((vendor) => (
                      <tr key={vendor.id} className="border-b border-gray-900">
                        {[
                          "service_name",
                          "years_of_excellence",
                          "email",
                          "contact_number",
                          "address",
                          "selected_services",
                          "type",
                          "active",
                          "expertise_in",
                        ].map((field) => (
                          <td key={field} className="p-3">
                            <input
                              type="text"
                              value={vendor[field as keyof Vendor] ?? ""}
                              onChange={(e) =>
                                handleInputChange(e, vendor.id, field as keyof Vendor)
                              }
                              className="w-full p-1 border rounded bg-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex justify-center gap-6 mt-8">
              <button 
                onClick={handleApprove}
                className="bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition font-medium"
              >
                ✅ Approve Selected Vendors
              </button>
              <button 
                onClick={handleReject}
                className="bg-yellow-500 text-white px-8 py-3 rounded-lg hover:bg-yellow-600 transition font-medium"
              >
                ❌ Reject Selected Vendors
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default PendingVendorsPage;