"use client";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
    else {
      window.location.href = "/pages/loginpage";
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Welcome to VentureSpark</h1>
      {email ? (
        <p className="mt-4 text-lg">Logged in as: {email}</p>
      ) : (
        <p className="mt-4 text-lg">Not logged in</p>
      )}
      <button
  onClick={() => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.href = "/pages/login"; 
  }}
  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
>
  Logout
</button>
    </div>
    
  );
}
