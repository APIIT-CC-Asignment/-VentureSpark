"use client";

import { useEffect } from "react";

export default function VendorDetailsRedirect() {
  useEffect(() => {
    console.log("Redirecting from vendordetails to vendor-dashboard");
    window.location.replace("/pages/vendor-dashboard");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1E3A8A] to-[#10B981]">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-[#1E3A8A]">Redirecting...</h1>
        <p className="text-gray-600 mb-6">
          You are being redirected to the vendor dashboard.
        </p>
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#10B981] mx-auto mb-6"></div>
        <a
          href="/pages/vendor-dashboard"
          className="inline-block bg-gradient-to-r from-[#1E3A8A] to-[#10B981] text-white font-medium rounded-lg px-5 py-2.5"
        >
          Continue to Dashboard
        </a>
      </div>
    </div>
  );
}