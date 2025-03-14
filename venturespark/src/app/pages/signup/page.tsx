"use client";
import Image from "next/image";
import { useState } from "react";
import { signIn } from "next-auth/react";

// export const metadata: Metadata = {
//   title: "Sign Up | VentureSpark",
//   description: "Sign up for VentureSpark to connect with investors and grow your business.",
// };


export default function Signup() {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    message: "",
  });
  const [status, setStatus] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Submitting...");
  
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setStatus("Registration successful!");
        alert("Registration successful!");
        
        setFormData({ username: "", email: "", password: "", message: "" });
      } else {
        if (response.status === 409) {
          setStatus(`Error: ${data.message}`);
          alert(data.message);
        } else {
          setStatus(`Error: ${data.message}`);
          alert(`Error: ${data.message}`);
        }
      }
    } catch (error) {
      setStatus("Error: Could not connect to server");
      alert("Error: Could not connect to server");
    }
  };
    
    
  return (
   
<div className="flex h-screen">

  <div className="hidden lg:flex items-center justify-center flex-1 bg-white text-black">
    <div className="max-w-md text-center">
        <img src="/image/logo.png" alt="" />
    </div>
  </div>
  <div className="w-full bg-gray-100 lg:w-1/2 flex items-center justify-center">
    <div className="max-w-md w-full p-6">
      <h1 className="text-3xl font-semibold mb-6 text-black text-center">Client Sign Up</h1>
  
      <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center">Join to Our Community with all time access and free </h1>
      <div className="mt-4 flex flex-col lg:flex-row items-center justify-between">
      <div className="w-full lg:w-1/2 mb-2 lg:mb-0">
  <button 
    onClick={() => signIn("google")}
    className="px-4 py-2 bg-white text-black rounded flex items-center"
  >
    <img 
      src="/image/google.png" 
      alt="Google Logo" 
      className="w-5 h-5 mr-2"
    />
    Sign in with Google
  </button>
</div>

        <div className="w-full lg:w-1/2 ml-0 lg:ml-2">
          <button  onClick={() => signIn("facebook")} type="button" className="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300">
            <img src="/image/fb.png " alt="" /> Sign in with FaceBook </button>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-600 text-center">
        <p>or with email</p>
      </div>
      <form onSubmit={handleSubmit} method="POST" className="space-y-4">
        
        <div>
          <label htmlFor="username"   className="block text-sm font-medium text-gray-700">Username</label>
          <input type="text" id="username" name="username" value={formData.username}
            onChange={handleChange} required  className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300 text-black" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input type="text" id="email" name="email" value={formData.email}
            onChange={handleChange} required className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300  text-black"/>
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" id="password" name="password" value={formData.password}
            onChange={handleChange} required  className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300  text-black"/>
        </div>
        <div>
          <button type="submit" className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300">Sign Up</button>
        </div>
        <p>{status}</p>
      </form>
    
      <div className="mt-4 text-sm text-gray-600 text-center">
        <p>Already have an account? <a href="/pages/loginpage" className="text-black hover:underline">Login here</a>
        </p>
      </div>
    </div>
  </div>
</div>
  
  );
}
function setUsername(arg0: string) {
  throw new Error("Function not implemented.");
}

function setEmail(arg0: string) {
  throw new Error("Function not implemented.");
}

function setPassword(arg0: string) {
  throw new Error("Function not implemented.");
}

