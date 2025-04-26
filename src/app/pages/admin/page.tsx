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
// import { useRouter } from "next/navigation";

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

// // Updated color scheme to match the blue-to-teal gradient
// const COLORS = ["#1e40af", "#0d9488"]; // Dark blue & Teal

// const AdminPage = () => {
//   const router = useRouter();

//   const handlePendingClick = () => {
//     router.push("/pages/pvendors");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-800">
//       {/* Header - Updated to full width by removing mx-4 */}
//       <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-blue-800 to-teal-600 text-white shadow-lg px-6 py-4 flex justify-between items-center">
//         <img src="/logo.png" alt="Venture Spark Logo" className="h-10" />
//         <nav className="hidden md:flex gap-6 font-semibold text-white">
//           <a href="#" className="hover:text-teal-200 transition">Home</a>
//           <a href="#" className="hover:text-teal-200 transition">About</a>
//           <a href="#" className="hover:text-teal-200 transition">Services</a>
//           <a href="#" className="hover:text-teal-200 transition">Contact</a>
//           <a href="#" className="hover:text-teal-200 transition">Registration</a>
//         </nav>
//         <div className="flex items-center gap-4">
//           <h1 className="text-xl font-bold text-white">Venture Spark Admin</h1>
//           <div className="w-10 h-10 rounded-full bg-white border border-white shadow-inner" />
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 pt-20 pb-16">
//         <h2 className="text-3xl font-extrabold text-green-300 text-center mb-10">
//           Admin Dashboard
//         </h2>

//         {/* Vendor & User Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Vendor - Made Clickable */}
//           <div
//             onClick={handlePendingClick}
//             className="cursor-pointer bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition transform hover:-translate-y-1 hover:shadow-xl"
//           >
//             <h3 className="text-2xl font-bold text-blue-800 mb-2">
//               Vendor Applications
//             </h3>
//             <p className="text-gray-600 mb-6">
//               Review and manage vendor application approvals.
//             </p>
//             <div className="flex gap-4">
//               <button className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition font-semibold">
//                 ✅ Approve
//               </button>
//               <button className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold">
//                 ❌ Reject
//               </button>
//             </div>
//           </div>

//           {/* User */}
//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition transform hover:-translate-y-1 hover:shadow-xl">
//             <h3 className="text-2xl font-bold text-blue-800 mb-2">
//               User Applications
//             </h3>
//             <p className="text-gray-600 mb-6">
//               Review and manage user application approvals.
//             </p>
//             <div className="flex gap-4">
//               <button className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition font-semibold">
//                 ✅ Approve
//               </button>
//               <button className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold">
//                 ❌ Reject
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Analytics Section */}
//         <section className="mt-16">
//           <div className="text-center mb-8">
//             <h3 className="text-3xl font-extrabold text-blue-800">Patient Analytics</h3>
//             <p className="text-gray-500 mt-2">
//               Snapshot of patient metrics and trends
//             </p>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
//               <h4 className="text-gray-500 mb-1">Total Patients</h4>
//               <p className="text-4xl font-bold text-green-700">3,256</p>
//             </div>
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
//               <h4 className="text-gray-500 mb-1">Available Staff</h4>
//               <p className="text-4xl font-bold text-blue-800">394</p>
//             </div>
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
//               <h4 className="text-gray-500 mb-1">Avg. Treatment Cost</h4>
//               <p className="text-4xl font-bold text-blue-800">$2,536</p>
//             </div>
//           </div>

//           {/* Charts */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {/* Bar Chart */}
//             <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
//               <h4 className="text-xl font-semibold text-blue-800 mb-4">
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
//               <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">
//                 <h4 className="text-base font-medium text-blue-800 mb-3">
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
//               <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">
//                 <h4 className="text-base font-medium text-blue-800 mb-3">
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
//                           fill={COLORS[idx]}
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
// import { useRouter } from "next/navigation";

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

// const COLORS = ["#1e40af", "#0d9488"]; // Blue and Teal colors to match the image

// const AdminPage = () => {
//   const router = useRouter();

//   const handlePendingClick = () => {
//     router.push("/pages/pvendors");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header - Blue gradient */}
//       <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-blue-700 to-teal-600 px-6 py-4 flex justify-between items-center shadow-md">
//         <img src="/Venture Spark Logo" alt="Venture Spark Logo" className="h-6 text-white" />
//         <nav className="hidden md:flex gap-6 font-medium text-white">
//           <a href="#" className="hover:text-gray-200 transition">Home</a>
//           <a href="#" className="hover:text-gray-200 transition">About</a>
//           <a href="#" className="hover:text-gray-200 transition">Services</a>
//           <a href="#" className="hover:text-gray-200 transition">Contact</a>
//           <a href="#" className="hover:text-gray-200 transition">Registration</a>
//         </nav>
//         <div className="flex items-center gap-3">
//           <h1 className="text-white font-medium">Venture Spark Admin</h1>
//           <div className="w-8 h-8 rounded-full bg-white" />
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 pt-24 pb-16">
//         <h2 className="text-4xl font-bold text-green-400 text-center mb-12">
//           Admin Dashboard
//         </h2>

//         {/* Vendor & User Cards - Using white cards with blue headings */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
//           {/* Vendor Applications */}
//           <div
//             onClick={handlePendingClick}
//             className="cursor-pointer bg-white rounded-lg shadow-md p-6"
//           >
//             <h3 className="text-2xl font-bold text-blue-700 mb-2">
//               Vendor Applications
//             </h3>
//             <p className="text-gray-600 mb-6">
//               Review and manage vendor application approvals.
//             </p>
//             <div className="flex gap-4">
//               <button className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition font-medium">
//                 ✅ Approve
//               </button>
//               <button className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition font-medium">
//                 ❌ Reject
//               </button>
//             </div>
//           </div>

//           {/* User Applications */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h3 className="text-2xl font-bold text-blue-700 mb-2">
//               User Applications
//             </h3>
//             <p className="text-gray-600 mb-6">
//               Review and manage user application approvals.
//             </p>
//             <div className="flex gap-4">
//               <button className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition font-medium">
//                 ✅ Approve
//               </button>
//               <button className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition font-medium">
//                 ❌ Reject
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Analytics Section */}
//         <section className="mt-16">
//           <div className="text-center mb-6">
//             <h3 className="text-3xl font-bold text-blue-700">Patient Analytics</h3>
//             <p className="text-gray-500 mt-1">
//               Snapshot of patient metrics and trends
//             </p>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//             <div className="bg-white rounded-lg shadow-md p-6 text-center">
//               <h4 className="text-gray-500 mb-1">Total Patients</h4>
//               <p className="text-4xl font-bold text-green-600">3,256</p>
//             </div>
//             <div className="bg-white rounded-lg shadow-md p-6 text-center">
//               <h4 className="text-gray-500 mb-1">Available Staff</h4>
//               <p className="text-4xl font-bold text-blue-600">394</p>
//             </div>
//             <div className="bg-white rounded-lg shadow-md p-6 text-center">
//               <h4 className="text-gray-500 mb-1">Avg. Treatment Cost</h4>
//               <p className="text-4xl font-bold text-blue-600">$2,536</p>
//             </div>
//           </div>

//           {/* Charts */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {/* Bar Chart */}
//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <h4 className="text-xl font-medium text-blue-800 mb-4">
//                 Outpatients vs. Inpatients
//               </h4>
//               <ResponsiveContainer width="100%" height={250}>
//                 <BarChart data={barData}>
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="inpatients" fill="#1e40af" /> {/* Blue bars for inpatients */}
//                   <Bar dataKey="outpatients" fill="#0d9488" /> {/* Teal bars for outpatients */}
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>

//             {/* Pie Charts */}
//             <div className="grid grid-cols-2 gap-6">
//               <div className="bg-white p-6 rounded-lg shadow-md text-center">
//                 <h4 className="text-base font-medium text-blue-800 mb-3">
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
//                         <Cell key={idx} fill={idx === 0 ? "#1e40af" : "#0d9488"} />
//                       ))}
//                     </Pie>
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//               <div className="bg-white p-6 rounded-lg shadow-md text-center">
//                 <h4 className="text-base font-medium text-blue-800 mb-3">
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
//                           fill={idx === 0 ? "#1e40af" : "#0d9488"}
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
// import { useRouter } from "next/navigation";
// import {
//   Users,
//   Briefcase,
//   TrendingUp,
//   Bell,
//   Search,
//   DollarSign
// } from "lucide-react";

// // Preserving the exact same data structure
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

// // Enhanced color scheme while keeping blue and teal base
// const COLORS = ["#1e40af", "#0d9488"]; // Blue and Teal colors

// const AdminPage = () => {
//   const router = useRouter();

//   const handlePendingClick = () => {
//     router.push("/pages/pvendors");
//   };

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Sidebar - New element for improved navigation */}
//       <div className="fixed top-0 left-0 h-full w-64 bg-slate-900 text-white z-50">
//         <div className="p-6">
//           <div className="flex items-center gap-3 mb-10">
//             <div className="w-8 h-8 rounded-md bg-gradient-to-r from-blue-500 to-teal-400"></div>
//             <h1 className="text-xl font-bold">Venture Spark</h1>
//           </div>

//           <nav className="space-y-1">
//             <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800 text-blue-400">
//               <Briefcase size={18} />
//               <span>Dashboard</span>
//             </button>

//             <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition">
//               <Users size={18} />
//               <span>Applications</span>
//             </button>

//             <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition">
//               <TrendingUp size={18} />
//               <span>Analytics</span>
//             </button>

//             <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition">
//               <DollarSign size={18} />
//               <span>Financials</span>
//             </button>
//           </nav>
//         </div>
//       </div>

//       {/* Main content area - shifted to accommodate sidebar */}
//       <div className="ml-64">
//         {/* Header - Modified but preserving core functionality */}
//         <header className="sticky top-0 z-40 w-full bg-white shadow-sm px-6 py-4">
//           <div className="flex justify-between items-center">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
//               />
//               <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
//             </div>

//             <div className="flex items-center gap-4">
//               <button className="relative p-2 rounded-full hover:bg-slate-100 transition">
//                 <Bell size={20} />
//                 <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//               </button>

//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white font-medium">
//                   AS
//                 </div>
//                 <div className="hidden md:block">
//                   <p className="font-medium text-slate-800">Admin</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Main Content */}
//         <main className="px-8 py-8">
//           <h2 className="text-3xl font-bold text-green-400 text-center mb-10">
//             Admin Dashboard
//           </h2>

//           {/* Vendor & User Cards - preserving onClick functionality */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
//             {/* Vendor Applications - keeping handlePendingClick */}
//             <div
//               onClick={handlePendingClick}
//               className="cursor-pointer bg-white rounded-xl shadow-md p-6 border border-slate-100 transition transform hover:-translate-y-1 hover:shadow-lg"
//             >
//               <div className="flex justify-between mb-3">
//                 <h3 className="text-2xl font-bold text-blue-700">
//                   Vendor Applications
//                 </h3>
//                 <div className="bg-blue-100 p-2 rounded-lg">
//                   <Briefcase size={20} className="text-blue-600" />
//                 </div>
//               </div>
//               <p className="text-gray-600 mb-6">
//                 Review and manage vendor application approvals.
//               </p>
//               <div className="flex gap-4">
//                 <button className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition font-medium">
//                   ✅ Approve
//                 </button>
//                 <button className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition font-medium">
//                   ❌ Reject
//                 </button>
//               </div>
//             </div>

//             {/* User Applications */}
//             <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 transition transform hover:-translate-y-1 hover:shadow-lg">
//               <div className="flex justify-between mb-3">
//                 <h3 className="text-2xl font-bold text-blue-700">
//                   User Applications
//                 </h3>
//                 <div className="bg-teal-100 p-2 rounded-lg">
//                   <Users size={20} className="text-teal-600" />
//                 </div>
//               </div>
//               <p className="text-gray-600 mb-6">
//                 Review and manage user application approvals.
//               </p>
//               <div className="flex gap-4">
//                 <button className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition font-medium">
//                   ✅ Approve
//                 </button>
//                 <button className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition font-medium">
//                   ❌ Reject
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Analytics Section - keeping the same data structure */}
//           <section className="mt-16">
//             <div className="text-center mb-8">
//               <h3 className="text-3xl font-bold text-blue-700">Patient Analytics</h3>
//               <p className="text-gray-500 mt-1">
//                 Snapshot of patient metrics and trends
//               </p>
//             </div>

//             {/* Stats Cards - Improved design but same content */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//               <div className="bg-white rounded-xl shadow-md p-6 text-center border border-slate-100">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h4 className="text-sm font-medium text-gray-500 mb-1 text-left">Total Patients</h4>
//                     <p className="text-3xl font-bold text-green-600 text-left">3,256</p>
//                   </div>
//                   <div className="bg-green-100 p-2 rounded-lg">
//                     <Users size={20} className="text-green-600" />
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white rounded-xl shadow-md p-6 text-center border border-slate-100">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h4 className="text-sm font-medium text-gray-500 mb-1 text-left">Available Staff</h4>
//                     <p className="text-3xl font-bold text-blue-600 text-left">394</p>
//                   </div>
//                   <div className="bg-blue-100 p-2 rounded-lg">
//                     <Users size={20} className="text-blue-600" />
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white rounded-xl shadow-md p-6 text-center border border-slate-100">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h4 className="text-sm font-medium text-gray-500 mb-1 text-left">Avg. Treatment Cost</h4>
//                     <p className="text-3xl font-bold text-blue-600 text-left">$2,536</p>
//                   </div>
//                   <div className="bg-blue-100 p-2 rounded-lg">
//                     <DollarSign size={20} className="text-blue-600" />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Charts - Keeping same data and structure */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {/* Bar Chart */}
//               <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
//                 <h4 className="text-xl font-medium text-blue-800 mb-4">
//                   Outpatients vs. Inpatients
//                 </h4>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <BarChart data={barData}>
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="inpatients" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
//                     <Bar dataKey="outpatients" fill={COLORS[1]} radius={[4, 4, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>

//               {/* Pie Charts - Same data but with improved visuals */}
//               <div className="grid grid-cols-2 gap-6">
//                 <div className="bg-white p-6 rounded-xl shadow-md text-center border border-slate-100">
//                   <h4 className="text-base font-medium text-blue-800 mb-3">
//                     Patient Type
//                   </h4>
//                   <ResponsiveContainer width="100%" height={200}>
//                     <PieChart>
//                       <Pie
//                         data={pieData}
//                         dataKey="value"
//                         cx="50%"
//                         cy="50%"
//                         outerRadius={60}
//                         innerRadius={40}
//                         paddingAngle={2}
//                         label
//                       >
//                         {pieData.map((entry, idx) => (
//                           <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//                 <div className="bg-white p-6 rounded-xl shadow-md text-center border border-slate-100">
//                   <h4 className="text-base font-medium text-blue-800 mb-3">
//                     Gender Breakdown
//                   </h4>
//                   <ResponsiveContainer width="100%" height={200}>
//                     <PieChart>
//                       <Pie
//                         data={genderData}
//                         dataKey="value"
//                         cx="50%"
//                         cy="50%"
//                         outerRadius={60}
//                         innerRadius={40}
//                         paddingAngle={2}
//                         label
//                       >
//                         {genderData.map((entry, idx) => (
//                           <Cell
//                             key={idx}
//                             fill={COLORS[idx % COLORS.length]}
//                           />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//             </div>
//           </section>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminPage;

"use client";

import React, { useState, useEffect } from "react";
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
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Users,
  Briefcase,
  TrendingUp,
  ChevronDown,
  Bell,
  Search,
  CheckCircle,
  XCircle,
  Layers,
  DollarSign,
  UserPlus,
  Star,
  Filter,
  ArrowRight
} from "lucide-react";

// Data for startup metrics
const userGrowthData = [
  { month: "Oct", users: 245, premium: 42 },
  { month: "Nov", users: 310, premium: 67 },
  { month: "Dec", users: 452, premium: 98 },
  { month: "Jan", users: 563, premium: 124 },
  { month: "Feb", users: 612, premium: 156 },
  { month: "Mar", users: 721, premium: 203 },
];

const revenueData = [
  { month: "Oct", value: 8400 },
  { month: "Nov", value: 12300 },
  { month: "Dec", value: 17500 },
  { month: "Jan", value: 22100 },
  { month: "Feb", value: 24800 },
  { month: "Mar", value: 29600 },
];

const acquisitionData = [
  { name: "Organic", value: 43 },
  { name: "Referral", value: 24 },
  { name: "Direct", value: 21 },
  { name: "Social", value: 12 },
];

const platformData = [
  { name: "Web", value: 62 },
  { name: "Mobile", value: 38 },
];

// Color scheme
const COLORS = {
  primary: "#3b82f6",
  secondary: "#0ea5e9",
  tertiary: "#10b981",
  accent: "#8b5cf6",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  dark: "#1e293b",
  light: "#f8fafc",
  chartColors: ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"]
};

// Define Vendor type
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

const AdminPage = () => {
  const [selectedTab, setSelectedTab] = useState("applications");
  const [applicationView, setApplicationView] = useState("vendors");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleVendors, setVisibleVendors] = useState(5);
  const [statusUpdating, setStatusUpdating] = useState<{ [key: number]: boolean }>({});

  // Fetch vendors from API
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/vendors");

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        console.log("All fetched vendors:", data);

        // Log unique active status values to see what you have
        const activeValues = [...new Set(data.map((vendor: { active: any; }) => vendor.active))];
        console.log("Unique active status values:", activeValues);

        setVendors(data);
      } catch (error) {
        console.error("Failed to fetch vendors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  // Filter pending vendors - where active = "1" (pending)
  // const pendingVendors = vendors.filter(vendor => vendor.active === "0");
  const pendingVendors = vendors;

  // Handle approval/rejection
  const handleStatusChange = async (id: number, newStatus: 'approved' | 'rejected') => {
    try {
      setStatusUpdating(prev => ({ ...prev, [id]: true }));

      const statusValue = newStatus === 'approved' ? "0" : "2"; // 0 for approved, 2 for rejected

      const response = await fetch(`/api/vendors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: statusValue }),
      });

      if (!response.ok) {
        throw new Error('Failed to update vendor status');
      }

      // Update local state
      setVendors(prev =>
        prev.map(vendor =>
          vendor.id === id ? { ...vendor, active: statusValue } : vendor
        )
      );

    } catch (error) {
      console.error('Error updating vendor status:', error);
    } finally {
      setStatusUpdating(prev => ({ ...prev, [id]: false }));
    }
  };

  // Handle bulk actions
  const handleBulkApprove = () => {
    const pending = pendingVendors.slice(0, visibleVendors);
    pending.forEach(vendor => handleStatusChange(vendor.id, 'approved'));
  };

  const handleBulkReject = () => {
    const pending = pendingVendors.slice(0, visibleVendors);
    pending.forEach(vendor => handleStatusChange(vendor.id, 'rejected'));
  };

  const showMoreVendors = () => {
    setVisibleVendors(prev => prev + 5);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-64 bg-slate-900 text-white z-50">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-md bg-gradient-to-r from-blue-500 to-teal-400"></div>
            <h1 className="text-xl font-bold">Venture Spark</h1>
          </div>

          <nav className="space-y-1">
            <button
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${selectedTab === 'dashboard' ? 'bg-slate-800 text-blue-400' : 'hover:bg-slate-800'}`}
              onClick={() => setSelectedTab('dashboard')}
            >
              <Layers size={18} />
              <span>Dashboard</span>
            </button>

            <button
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${selectedTab === 'applications' ? 'bg-slate-800 text-blue-400' : 'hover:bg-slate-800'}`}
              onClick={() => setSelectedTab('applications')}
            >
              <Briefcase size={18} />
              <span>Applications</span>
            </button>

            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition hover:bg-slate-800"
            >
              <Users size={18} />
              <span>Users</span>
            </button>

            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition hover:bg-slate-800"
            >
              <TrendingUp size={18} />
              <span>Analytics</span>
            </button>

            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition hover:bg-slate-800"
            >
              <DollarSign size={18} />
              <span>Financials</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full bg-white shadow-sm px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="relative mr-4">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
                <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-full hover:bg-slate-100 transition">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white font-medium">
                  AS
                </div>
                <div className="hidden md:block">
                  <p className="font-medium text-black">Admin</p>
                </div>
                <ChevronDown size={16} className="text-slate-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="px-8 py-6">
          {selectedTab === 'dashboard' && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-black">Dashboard</h2>
                <p className="text-black">Welcome back! Here's what's happening.</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-black">Total Users</p>
                      <h3 className="text-2xl font-bold text-black mt-1">721</h3>
                      <p className="text-xs font-medium text-green-600 mt-2 flex items-center">
                        <TrendingUp size={14} className="mr-1" /> +17.8% this month
                      </p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Users size={20} className="text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-black">Premium Users</p>
                      <h3 className="text-2xl font-bold text-black mt-1">203</h3>
                      <p className="text-xs font-medium text-green-600 mt-2 flex items-center">
                        <TrendingUp size={14} className="mr-1" /> +30.1% this month
                      </p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Star size={20} className="text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-black">New Applications</p>
                      <h3 className="text-2xl font-bold text-black mt-1">{pendingVendors.length}</h3>
                      <p className="text-xs font-medium text-green-600 mt-2 flex items-center">
                        <TrendingUp size={14} className="mr-1" /> +5.4% this week
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <UserPlus size={20} className="text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-black">Monthly Revenue</p>
                      <h3 className="text-2xl font-bold text-black mt-1">$29.6K</h3>
                      <p className="text-xs font-medium text-green-600 mt-2 flex items-center">
                        <TrendingUp size={14} className="mr-1" /> +19.3% this month
                      </p>
                    </div>
                    <div className="bg-emerald-100 p-3 rounded-lg">
                      <DollarSign size={20} className="text-emerald-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                {/* User Growth Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-semibold text-black">User Growth</h4>
                    <select className="text-sm border border-slate-200 rounded-md px-2 py-1 text-black">
                      <option>Last 6 Months</option>
                      <option>Last Year</option>
                    </select>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="users" name="Total Users" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="premium" name="Premium Users" fill={COLORS.accent} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-semibold text-black">Revenue</h4>
                    <select className="text-sm border border-slate-200 rounded-md px-2 py-1 text-black">
                      <option>Last 6 Months</option>
                      <option>Last Year</option>
                    </select>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={COLORS.tertiary}
                        strokeWidth={3}
                        dot={{ stroke: COLORS.tertiary, strokeWidth: 2, r: 4, fill: "white" }}
                        activeDot={{ r: 6, stroke: COLORS.tertiary, strokeWidth: 2, fill: "white" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Distribution Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Acquisition Channel */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <h4 className="font-semibold text-black mb-6">Acquisition Channels</h4>
                  <div className="flex">
                    <div className="w-1/2">
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie
                            data={acquisitionData}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                          >
                            {acquisitionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS.chartColors[index % COLORS.chartColors.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-1/2 flex flex-col justify-center">
                      {acquisitionData.map((item, index) => (
                        <div key={index} className="flex items-center mb-3">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: COLORS.chartColors[index % COLORS.chartColors.length] }}
                          ></div>
                          <p className="text-sm text-black">{item.name}: <span className="font-medium">{item.value}%</span></p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Platform Usage */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <h4 className="font-semibold text-black mb-6">Platform Usage</h4>
                  <div className="flex">
                    <div className="w-1/2">
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie
                            data={platformData}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                          >
                            {platformData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS.chartColors[index]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-1/2 flex flex-col justify-center">
                      {platformData.map((item, index) => (
                        <div key={index} className="flex items-center mb-3">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: COLORS.chartColors[index] }}
                          ></div>
                          <p className="text-sm text-black">{item.name}: <span className="font-medium">{item.value}%</span></p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {selectedTab === 'applications' && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-black">Application Management</h2>
                <p className="text-black">Review and manage incoming applications</p>
              </div>

              {/* Vendor Cards */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-12">
                {/* Vendor Applications */}
                <div
                  onClick={() => setApplicationView('vendors')}
                  className={`cursor-pointer bg-white rounded-xl shadow-md p-6 border border-slate-100 transition transform hover:-translate-y-1 hover:shadow-lg ${applicationView === 'vendors' ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <div className="flex justify-between mb-3">
                    <h3 className="text-2xl font-bold text-black">
                      Vendor Applications
                    </h3>
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Briefcase size={20} className="text-blue-600" />
                    </div>
                  </div>
                  <p className="text-black mb-6">
                    Review and manage vendor application approvals. <span className="font-medium text-blue-600">{pendingVendors.length} pending</span>
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBulkApprove();
                      }}
                      className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition font-medium"
                    >
                      ✅ Approve All
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBulkReject();
                      }}
                      className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition font-medium"
                    >
                      ❌ Reject All
                    </button>
                  </div>
                </div>
              </div>

              {/* Vendor Applications Table */}
              {applicationView === 'vendors' && (
                <>
                  {loading ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-10 text-center">
                      <p className="text-black text-lg">Loading vendor applications...</p>
                    </div>
                  ) : pendingVendors.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-10 text-center">
                      <p className="text-black">No pending vendor applications found.</p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-white rounded-xl shadow-sm border border-slate-100 mb-8 overflow-hidden">
                        <div className="flex justify-between items-center px-6 py-4 bg-slate-50 border-b border-slate-100">
                          <h3 className="font-semibold text-black">Pending Vendor Applications</h3>
                          <div className="flex items-center gap-2">
                            <Filter size={16} className="text-slate-500" />
                            <select className="text-sm border border-slate-200 rounded-md px-2 py-1 text-black">
                              <option>All Types</option>
                              <option>SaaS Provider</option>
                              <option>Agency</option>
                              <option>Consultant</option>
                            </select>
                          </div>
                        </div>
                        <table className="w-full text-black">
                          <thead>
                            <tr className="bg-slate-50">
                              <th className="text-left py-4 px-6 text-xs font-semibold text-black uppercase">Company</th>
                              <th className="text-left py-4 px-6 text-xs font-semibold text-black uppercase">Email</th>
                              <th className="text-left py-4 px-6 text-xs font-semibold text-black uppercase">Expertise</th>
                              <th className="text-left py-4 px-6 text-xs font-semibold text-black uppercase">Type</th>
                              <th className="text-right py-4 px-6 text-xs font-semibold text-black uppercase">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pendingVendors.slice(0, visibleVendors).map((vendor) => (
                              <tr key={vendor.id} className="border-t border-slate-100 hover:bg-slate-50 transition">
                                <td className="py-4 px-6">
                                  <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold mr-3">
                                      {vendor.service_name.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="font-medium text-black">{vendor.service_name}</p>
                                      <p className="text-xs text-black">{vendor.years_of_excellence} years in business</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-6 text-black">
                                  {vendor.email}
                                </td>
                                <td className="py-4 px-6 text-black">
                                  {vendor.expertise_in || "Not specified"}
                                </td>
                                <td className="py-4 px-6">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {vendor.type || "Service Provider"}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-right">
                                  <div className="flex justify-end gap-2">
                                    <button
                                      className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition disabled:opacity-50"
                                      onClick={() => handleStatusChange(vendor.id, 'approved')}
                                      disabled={statusUpdating[vendor.id]}
                                    >
                                      <CheckCircle size={18} />
                                    </button>
                                    <button
                                      className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition disabled:opacity-50"
                                      onClick={() => handleStatusChange(vendor.id, 'rejected')}
                                      disabled={statusUpdating[vendor.id]}
                                    >
                                      <XCircle size={18} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {pendingVendors.length > visibleVendors && (
                          <div className="flex justify-center p-4 border-t border-slate-100">
                            <button
                              onClick={showMoreVendors}
                              className="flex items-center text-blue-600 font-medium hover:text-blue-800 transition"
                            >
                              Show More <ArrowRight size={16} className="ml-1" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Vendor Details Panel - Could be expanded here */}
                      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h3 className="font-semibold text-black mb-4">Additional Information</h3>
                        <p className="text-black">
                          Select a vendor from the table above to view detailed information and application history.
                        </p>
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;