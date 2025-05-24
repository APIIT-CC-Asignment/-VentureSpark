"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session) {
        localStorage.setItem("email", session.user?.email || "");
        localStorage.setItem("name", session.user?.name || "");
        localStorage.setItem("image", session.user?.image || "");
      }
    };

    fetchSession();
  }, []);

  // Direct redirect function that bypasses router
  const redirectTo = (path: string) => {
    console.log(`Redirecting to ${path} using direct navigation`);
    window.location.replace(path);
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setStatus("Submitting...");

    try {
      const response = await fetch("/api/loginpage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (response.ok) {
        setStatus("Login successful!");

        localStorage.setItem("token", data.token);
        localStorage.setItem("email", formData.email);
        localStorage.setItem("username", data.name || "");
        localStorage.setItem("typegroup", data.typegroup);

        console.log("User type:", data.typegroup);

        // Check if user is a vendor based on typegroup
        if (data.typegroup === 'vendor') {
          console.log("Setting vendor auth with ID:", data.vendorId);
          const authData = {
            isAuthenticated: true,
            vendorId: data.vendorId || formData.email, // Use vendorId from response or email as fallback
            email: formData.email
          };
          localStorage.setItem("vendorAuth", JSON.stringify(authData));
          console.log("Vendor auth data saved:", authData);

          // Force redirect to vendor dashboard immediately
          console.log("Redirecting to vendor dashboard...");
          setTimeout(() => redirectTo("/pages/vendor-dashboard"), 100);
        } else if (data.typegroup === 'client') {
          // Redirect regular users to user profile page
          console.log("Redirecting to user profile...");
          redirectTo("/");
        } else if (data.typegroup === 'Admin') {
          // Redirect admins to admin dashboard
          console.log("Redirecting to admin dashboard...");
          redirectTo("/pages/admin");
        } else {
          // Default redirect for unknown types
          console.log("Unknown user type, redirecting to home...");
          redirectTo("/");
        }
      } else {
        setStatus(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      setStatus("Error: Could not connect to server");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A8A] to-[#10B981] shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Login VentureSpark</h1>
            </div>
            <div className="mt-4 flex flex-col lg:flex-row items-center justify-between gap-2">
              <div className="w-full lg:w-1/2">
                <button
                  onClick={() => signIn("google")}
                  type="button"
                  className="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
                >
                  <img src="/images/google.png" alt="" /> Sign In with Google
                </button>
              </div>

              <div className="w-full lg:w-1/2">
                <button
                  onClick={() => signIn("facebook")}
                  type="button"
                  className="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
                >
                  <img src="/images/fb.png" alt="" /> Sign In with Facebook
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="email"
                      name="email"
                      type="text"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-[#10B981]"
                      placeholder="Email address"
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Email Address
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="password"
                      name="password"
                      type="password"
                      onChange={handleChange}
                      required
                      value={formData.password}
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-[#10B981]"
                      placeholder="Password"
                    />
                    <label
                      htmlFor="password"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <button type="submit" className="w-full bg-gradient-to-b from-[#1E3A8A] to-[#10B981] text-white p-2 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#10B981] transition-colors duration-300">
                      Login
                    </button>
                  </div>
                  <div className="relative">{status && <p className="text-center">{status}</p>}</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600 text-center">
                <p>
                  Want To Create an account?{" "}
                  <a href="/pages/signup" className="text-[#1E3A8A] hover:underline">
                    As a User Sign up here
                  </a>
                </p>
              </div>
              <div className="mt-4 text-sm text-gray-600 text-center">
                <p>
                  Want To Create an account?{" "}
                  <a href="/pages/signup-vendor" className="text-[#1E3A8A] hover:underline">
                    As a Vendor Sign up here
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}