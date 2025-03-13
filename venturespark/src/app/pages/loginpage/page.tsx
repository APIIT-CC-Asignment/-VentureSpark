"use client";
import router from "next/router";
import { useRouter } from "next/navigation"; 

import React, { useState } from 'react';

// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Login | VentureSpark",
//   description: "Login to VentureSpark to connect with investors and grow your business.",
// };

export default function logingpage() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	  });
	  const [status, setStatus] = useState<string>("");
	
	  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	  };
	
	  const router = useRouter(); 

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setStatus("Submitting...");

  try {
    const response = await fetch("/api/loginpage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      setStatus("Login successful!");
      localStorage.setItem("token", data.token); 
      localStorage.setItem("email", formData.email);
      router.push("/"); 
    } else {
      setStatus(`Error: ${data.message}`);
    }
  } catch (error) {
    setStatus("Error: Could not connect to server");
  }
};


    return (

<div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
	<div className="relative py-3 sm:max-w-xl sm:mx-auto">
		<div
			className="absolute inset-0 bg-gradient-to-r from-green-300 to-[#9AFC1F] shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
		</div>
		<div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
			<div className="max-w-md mx-auto">
				<div>
					<h1 className="text-2xl font-semibold">Login VentureSpark</h1>
				</div>
			<form onSubmit={handleSubmit} className="">
				<div className="divide-y divide-gray-200">
					<div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
						<div className="relative">
							<input autoComplete="off" id="email" name="email" type="text" value={formData.email}  onChange={handleChange} required className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Email address" />
							<label htmlFor="email" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Email Address</label>
						</div>
						<div className="relative">
							<input autoComplete="off" id="password" name="password" type="password"   onChange={handleChange} required value={formData.password} className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Password" />
							<label htmlFor="password"  className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Password</label>
						</div>
						<div className="relative">
							<button className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300">Login</button>
						</div>
						<div className="relative">
							{status && <p>{status}</p>}
					</div>
					</div>
				</div>
			</form>
			</div>
		</div>
	</div>
</div>
    );
}