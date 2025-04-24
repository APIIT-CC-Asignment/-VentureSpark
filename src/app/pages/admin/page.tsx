// import React from "react";

// const AdminPage = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-800 to-green-500 p-6">
//       <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center rounded-lg">
//         <img src="/logo.png" alt="Venture Spark Logo" className="h-10" />
//         <nav className="flex gap-6">
//           <a href="#" className="text-gray-700 hover:text-blue-600 font-semibold">Home</a>
//           <a href="#" className="text-gray-700 hover:text-blue-600 font-semibold">About</a>
//           <a href="#" className="text-gray-700 hover:text-blue-600 font-semibold">Services</a>
//           <a href="#" className="text-gray-700 hover:text-blue-600 font-semibold">Contact</a>
//           <a href="#" className="text-gray-700 hover:text-blue-600 font-semibold">Registration</a>
//         </nav>
//         <div className="flex items-center gap-4">
//           <button className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition">Book a Session</button>
//           <div className="w-8 h-8 rounded-full bg-gray-300" />
//         </div>
//       </header>

//       <main className="mt-12 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Vendor Card */}
//         <div className="bg-white rounded-2xl shadow-lg p-6">
//           <h2 className="text-2xl font-bold text-blue-800 mb-4">Vendor Applications</h2>
//           <p className="text-gray-600 mb-6">Review and manage vendor application approvals.</p>
//           <div className="flex gap-4">
//             <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
//               Approve Vendor
//             </button>
//             <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
//               Reject Vendor
//             </button>
//           </div>
//         </div>

//         {/* User Card */}
//         <div className="bg-white rounded-2xl shadow-lg p-6">
//           <h2 className="text-2xl font-bold text-blue-800 mb-4">User Applications</h2>
//           <p className="text-gray-600 mb-6">Review and manage user application approvals.</p>
//           <div className="flex gap-4">
//             <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
//               Approve User
//             </button>
//             <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
//               Reject User
//             </button>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminPage;

// import React from "react";

// const AdminPage = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-tr from-blue-900 via-blue-700 to-green-600 text-gray-800">
//       {/* Header */}
//       <header className="sticky top-4 z-40 mx-4 mt-4 bg-white/80 backdrop-blur-md shadow-lg border border-white/40 rounded-2xl px-6 py-4 flex justify-between items-center">
//         <div className="flex items-center gap-4">
//           <img src="/logo.png" alt="Venture Spark Logo" className="h-10" />
//         </div>

//         <nav className="hidden md:flex gap-6 font-semibold text-gray-700">
//           <a href="#" className="hover:text-green-600 transition">Home</a>
//           <a href="#" className="hover:text-green-600 transition">About</a>
//           <a href="#" className="hover:text-green-600 transition">Services</a>
//           <a href="#" className="hover:text-green-600 transition">Contact</a>
//           <a href="#" className="hover:text-green-600 transition">Registration</a>
//         </nav>

//         <div className="flex items-center gap-4">
//         <h1 className="text-xl font-bold text-blue-800">Venture Spark Admin</h1>
//           <div className="w-10 h-10 rounded-full bg-gray-300 border border-white shadow-inner" />
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 pt-28 pb-16">
//         <h2 className="text-3xl font-extrabold text-white text-center mb-10 drop-shadow-md">Admin Dashboard</h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Vendor Card */}
//           <div className="bg-white rounded-2xl shadow-xl p-6 transition transform hover:-translate-y-1 hover:shadow-2xl">
//             <h3 className="text-2xl font-bold text-blue-800 mb-2">Vendor Applications</h3>
//             <p className="text-gray-600 mb-6">Review and manage vendor application approvals.</p>
//             <div className="flex gap-4">
//               <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
//                 ✅ Approve
//               </button>
//               <button className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold">
//                 ❌ Reject
//               </button>
//             </div>
//           </div>

//           {/* User Card */}
//           <div className="bg-white rounded-2xl shadow-xl p-6 transition transform hover:-translate-y-1 hover:shadow-2xl">
//             <h3 className="text-2xl font-bold text-blue-800 mb-2">User Applications</h3>
//             <p className="text-gray-600 mb-6">Review and manage user application approvals.</p>
//             <div className="flex gap-4">
//               <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
//                 ✅ Approve
//               </button>
//               <button className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold">
//                 ❌ Reject
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminPage;

// "use client";

// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";
// import { useRouter } from "next/navigation"; // Import router for navigation

// const pieData = [
//   { name: "Inpatients", value: 72 },
//   { name: "Outpatients", value: 28 },
// ];

// const genderData = [
//   { name: "Male", value: 60 },
//   { name: "Female", value: 40 },
// ];

// const barData = [
//   { name: "Oct", inpatients: 2400, outpatients: 600 },
//   { name: "Nov", inpatients: 3000, outpatients: 800 },
//   { name: "Dec", inpatients: 3500, outpatients: 900 },
//   { name: "Jan", inpatients: 2000, outpatients: 700 },
//   { name: "Feb", inpatients: 2800, outpatients: 750 },
//   { name: "Mar", inpatients: 3200, outpatients: 850 },
// ];

// const COLORS = ["#7e3af2", "#34d399"]; // Purple & Green

// const AdminPage = () => {
//   const router = useRouter();

//   const handlePendingClick = () => {
//     router.push("/pages/pvendors"); // Navigate to pending vendor page
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-tr from-blue-900 via-blue-700 to-green-600 text-gray-800">
//       {/* Header */}
//       <header className="sticky top-4 z-40 mx-4 mt-4 bg-white/80 backdrop-blur-md shadow-lg border border-white/40 rounded-2xl px-6 py-4 flex justify-between items-center">
//         <img src="/logo.png" alt="Venture Spark Logo" className="h-10" />
//         <nav className="hidden md:flex gap-6 font-semibold text-gray-700">
//           <a href="#" className="hover:text-green-600 transition">Home</a>
//           <a href="#" className="hover:text-green-600 transition">About</a>
//           <a href="#" className="hover:text-green-600 transition">Services</a>
//           <a href="#" className="hover:text-green-600 transition">Contact</a>
//           <a href="#" className="hover:text-green-600 transition">Registration</a>
//         </nav>
//         <div className="flex items-center gap-4">
//           <h1 className="text-xl font-bold text-blue-800">Venture Spark Admin</h1>
//           <div className="w-10 h-10 rounded-full bg-gray-300 border border-white shadow-inner" />
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 pt-28 pb-16">
//         <h2 className="text-3xl font-extrabold text-white text-center mb-10 drop-shadow-md">
//           Admin Dashboard
//         </h2>

//         {/* Vendor & User Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Vendor - Made Clickable */}
//           <div
//             onClick={handlePendingClick}
//             className="cursor-pointer bg-white rounded-2xl shadow-xl p-6 transition transform hover:-translate-y-1 hover:shadow-2xl"
//           >
//             <h3 className="text-2xl font-bold text-blue-800 mb-2">
//               Vendor Applications
//             </h3>
//             <p className="text-gray-600 mb-6">
//               Review and manage vendor application approvals.
//             </p>
//             <div className="flex gap-4">
//               <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
//                 ✅ Approve
//               </button>
//               <button className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold">
//                 ❌ Reject
//               </button>
//             </div>
//           </div>

//           {/* User */}
//           <div className="bg-white rounded-2xl shadow-xl p-6 transition transform hover:-translate-y-1 hover:shadow-2xl">
//             <h3 className="text-2xl font-bold text-blue-800 mb-2">
//               User Applications
//             </h3>
//             <p className="text-gray-600 mb-6">
//               Review and manage user application approvals.
//             </p>
//             <div className="flex gap-4">
//               <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
//                 ✅ Approve
//               </button>
//               <button className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold">
//                 ❌ Reject
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Analytics Section */}
//         <section className="mt-16">
//           <div className="text-center mb-8">
//             <h3 className="text-3xl font-extrabold text-white">Patient Analytics</h3>
//             <p className="text-gray-200 mt-2">
//               Snapshot of patient metrics and trends
//             </p>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//             <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
//               <h4 className="text-gray-500 mb-1">Total Patients</h4>
//               <p className="text-4xl font-bold text-blue-800">3,256</p>
//             </div>
//             <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
//               <h4 className="text-gray-500 mb-1">Available Staff</h4>
//               <p className="text-4xl font-bold text-blue-800">394</p>
//             </div>
//             <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
//               <h4 className="text-gray-500 mb-1">Avg. Treatment Cost</h4>
//               <p className="text-4xl font-bold text-blue-800">$2,536</p>
//             </div>
//           </div>

//           {/* Charts */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {/* Bar Chart */}
//             <div className="bg-white p-6 rounded-2xl shadow-lg">
//               <h4 className="text-xl font-semibold text-gray-700 mb-4">
//                 Outpatients vs. Inpatients
//               </h4>
//               <ResponsiveContainer width="100%" height={250}>
//                 <BarChart data={barData}>
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="inpatients" fill={COLORS[0]} />
//                   <Bar dataKey="outpatients" fill={COLORS[1]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>

//             {/* Pie Charts */}
//             <div className="grid grid-cols-2 gap-6">
//               <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
//                 <h4 className="text-base font-medium text-gray-600 mb-3">
//                   Patient Type
//                 </h4>
//                 <ResponsiveContainer width="100%" height={200}>
//                   <PieChart>
//                     <Pie
//                       data={pieData}
//                       dataKey="value"
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={60}
//                       label
//                     >
//                       {pieData.map((entry, idx) => (
//                         <Cell key={idx} fill={COLORS[idx]} />
//                       ))}
//                     </Pie>
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//               <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
//                 <h4 className="text-base font-medium text-gray-600 mb-3">
//                   Gender Breakdown
//                 </h4>
//                 <ResponsiveContainer width="100%" height={200}>
//                   <PieChart>
//                     <Pie
//                       data={genderData}
//                       dataKey="value"
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={60}
//                       label
//                     >
//                       {genderData.map((entry, idx) => (
//                         <Cell
//                           key={idx}
//                           fill={idx === 0 ? "#f59e0b" : "#6366f1"}
//                         />
//                       ))}
//                     </Pie>
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default AdminPage;

"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useRouter } from "next/navigation";

const pieData = [
  { name: "Inpatients", value: 72 },
  { name: "Outpatients", value: 28 },
];

const genderData = [
  { name: "Male", value: 60 },
  { name: "Female", value: 40 },
];

const barData = [
  { name: "Oct", inpatients: 2400, outpatients: 600 },
  { name: "Nov", inpatients: 3000, outpatients: 800 },
  { name: "Dec", inpatients: 3500, outpatients: 900 },
  { name: "Jan", inpatients: 2000, outpatients: 700 },
  { name: "Feb", inpatients: 2800, outpatients: 750 },
  { name: "Mar", inpatients: 3200, outpatients: 850 },
];

// Updated color scheme to match the blue-to-teal gradient
const COLORS = ["#1e40af", "#0d9488"]; // Dark blue & Teal

const AdminPage = () => {
  const router = useRouter();

  const handlePendingClick = () => {
    router.push("/pages/pvendors");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header - Updated to full width by removing mx-4 */}
      <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-blue-800 to-teal-600 text-white shadow-lg px-6 py-4 flex justify-between items-center">
        <img src="/logo.png" alt="Venture Spark Logo" className="h-10" />
        <nav className="hidden md:flex gap-6 font-semibold text-white">
          <a href="#" className="hover:text-teal-200 transition">Home</a>
          <a href="#" className="hover:text-teal-200 transition">About</a>
          <a href="#" className="hover:text-teal-200 transition">Services</a>
          <a href="#" className="hover:text-teal-200 transition">Contact</a>
          <a href="#" className="hover:text-teal-200 transition">Registration</a>
        </nav>
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">Venture Spark Admin</h1>
          <div className="w-10 h-10 rounded-full bg-white border border-white shadow-inner" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pt-20 pb-16">
        <h2 className="text-3xl font-extrabold text-green-300 text-center mb-10">
          Admin Dashboard
        </h2>

        {/* Vendor & User Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vendor - Made Clickable */}
          <div
            onClick={handlePendingClick}
            className="cursor-pointer bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition transform hover:-translate-y-1 hover:shadow-xl"
          >
            <h3 className="text-2xl font-bold text-blue-800 mb-2">
              Vendor Applications
            </h3>
            <p className="text-gray-600 mb-6">
              Review and manage vendor application approvals.
            </p>
            <div className="flex gap-4">
              <button className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition font-semibold">
                ✅ Approve
              </button>
              <button className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold">
                ❌ Reject
              </button>
            </div>
          </div>

          {/* User */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition transform hover:-translate-y-1 hover:shadow-xl">
            <h3 className="text-2xl font-bold text-blue-800 mb-2">
              User Applications
            </h3>
            <p className="text-gray-600 mb-6">
              Review and manage user application approvals.
            </p>
            <div className="flex gap-4">
              <button className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition font-semibold">
                ✅ Approve
              </button>
              <button className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold">
                ❌ Reject
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <section className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-extrabold text-blue-800">Patient Analytics</h3>
            <p className="text-gray-500 mt-2">
              Snapshot of patient metrics and trends
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
              <h4 className="text-gray-500 mb-1">Total Patients</h4>
              <p className="text-4xl font-bold text-green-700">3,256</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
              <h4 className="text-gray-500 mb-1">Available Staff</h4>
              <p className="text-4xl font-bold text-blue-800">394</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
              <h4 className="text-gray-500 mb-1">Avg. Treatment Cost</h4>
              <p className="text-4xl font-bold text-blue-800">$2,536</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bar Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h4 className="text-xl font-semibold text-blue-800 mb-4">
                Outpatients vs. Inpatients
              </h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="inpatients" fill={COLORS[0]} />
                  <Bar dataKey="outpatients" fill={COLORS[1]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Charts */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">
                <h4 className="text-base font-medium text-blue-800 mb-3">
                  Patient Type
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      label
                    >
                      {pieData.map((entry, idx) => (
                        <Cell key={idx} fill={COLORS[idx]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">
                <h4 className="text-base font-medium text-blue-800 mb-3">
                  Gender Breakdown
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={genderData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      label
                    >
                      {genderData.map((entry, idx) => (
                        <Cell
                          key={idx}
                          fill={COLORS[idx]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminPage;