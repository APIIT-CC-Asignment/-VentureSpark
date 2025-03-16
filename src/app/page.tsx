// "use client";
// import { useEffect, useState } from "react";

// export default function HomePage() {
//   const [email, setEmail] = useState<string | null>(null);

//   useEffect(() => {
//     const storedEmail = localStorage.getItem("email");
//     if (storedEmail) {
//       setEmail(storedEmail);
//     }
//     else {
//       window.location.href = "/pages/loginpage";
//     }
//   }, []);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center">
      
//       <h1 className="text-3xl font-bold">Welcome to VentureSpark</h1>
//       {email ? (
//         <p className="mt-4 text-lg">Logged in as: {email}</p>
//       ) : (
//         <p className="mt-4 text-lg">Not logged in</p>
//       )}
//       <button
//   onClick={() => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("email");
//     window.location.href = "/pages/login"; 
//   }}
//   className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
// >
//   Logout
// </button>
//     </div>
    
//   );
// }


import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SignOutButton from "../app/components/SignOutButton"; // Import the Client Component
import HomePage from "./components/HomePage";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
   <HomePage />
    

     
    </div>
  );
}

// {session ? (
//   <div className="mt-4 p-4 border rounded-lg shadow-md text-center">
//     <p className="text-lg font-semibold">Signed in as {session.user?.email}</p>
//     {session.user?.image && (
//       <img
//         src={session.user.image}
//         alt="User Profile"
//         className="w-16 h-16 rounded-full mt-2"
//       />
//     )}
//     <SignOutButton /> {/* Use the client component here */}
//   </div>
// ) : (
//   <p className="mt-4 text-red-500">Not signed in</p>
// )}