"use client";
import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import React from "react";

export default function VendorDetails() {
  const [email, setEmail] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setEmail(localStorage.getItem("email"));
    }
  }, []);

  const [formData, setFormData] = useState({
    service_name: "",
    years_of_excellence: 0,
    email: "",
    contact_number: "",
    address: "",
    selected_services: [] as string[],
    type: "Services",
  });

  useEffect(() => {
    // Update formData when email is loaded from localStorage
    if (email) {
      setFormData(prev => ({ ...prev, email }));
    }
  }, [email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    let updatedServices = [];
    
    if (checked) {
      updatedServices = [...selectedServices, value];
    } else {
      updatedServices = selectedServices.filter((service) => service !== value);
    }
    
    setSelectedServices(updatedServices);
    setFormData({ ...formData, selected_services: updatedServices });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!formData.service_name || !formData.contact_number || !formData.address) {
      alert("Please fill in all fields.");
      return;
    }
    
    try {
      const response = await fetch("/api/vendordetailsreg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        setFormData({
          service_name: "",
          years_of_excellence: 0,
          email: email || "",
          contact_number: "",
          address: "",
          selected_services: [],
          type: "Services",
        });
        setSelectedServices([]);
      } else {
        if (response.status === 409) {
          alert(data.message);
        } else {
          alert(`Error: ${data.message}`);
        }
      }
    } catch (error) {
      alert("Error: Could not connect to server");
    }
  };
  
    
  return (
    <div>
      <Navbar />

      <div className="flex grid-cols-2 gap-4 items-center justify-center min-h-screen p-6 bg-gray-100">
        {/* Left Section */}
        <div className="md:w-1/2 p-6">
          <h1 className="text-3xl font-bold mb-4 font-Positivus text-black">
            Join Our Expert Network
          </h1>
          <p className="text-black mb-6">
            Empower the next generation of entrepreneurs by sharing your
            expertise. Join our platform as a service provider and help shape
            Sri Lanka's startup ecosystem.
          </p>
          <button className="flex items-center space-x-2 text-gray-800 font-medium">
            <span>Learn More....</span>
          </button>
          {/* Benefits */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center p-4 border rounded-lg shadow-sm bg-white">
              <span className="text-2xl mr-4">🌍</span>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Expand your Reach
                </h2>
                <p className="text-gray-600">
                  Connect with a growing network of ambitious entrepreneurs and
                  scale your service business.
                </p>
              </div>
            </div>
            <div className="flex items-center p-4 border rounded-lg shadow-sm bg-white">
              <span className="text-2xl mr-4">➕</span>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Qualified Leads
                </h2>
                <p className="text-gray-600">
                  Access pre-qualified clients who are actively seeking your
                  expertise and services.
                </p>
              </div>
            </div>
            <div className="flex items-center p-4 border rounded-lg shadow-sm bg-white">
              <span className="text-2xl mr-4">💼</span>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Business Growth
                </h2>
                <p className="text-gray-600">
                  Leverage the platform's tools and resources to accelerate the
                  growth of your business.
                </p>
              </div>
            </div>
            <div className="flex items-center p-4 border rounded-lg shadow-sm bg-white">
              <span className="text-2xl mr-4">📊</span>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Analytics and Insights
                </h2>
                <p className="text-gray-600">
                  Gain valuable insights into your business performance and make
                  data-driven decisions.
                </p>
              </div>
            </div>
            <div className="flex items-center p-4 border rounded-lg shadow-sm bg-white">
              <span className="text-2xl mr-4">💡</span>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Expert Guidance
                </h2>
                <p className="text-gray-600">
                  Receive expert guidance from industry professionals to help
                  you overcome challenges and achieve success.
                </p>
              </div>
            </div>
            <div className="flex items-center p-4 border rounded-lg shadow-sm bg-white">
              <span className="text-2xl mr-4">🌱</span>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Continuous Learning
                </h2>
                <p className="text-gray-600">
                  Access a library of educational resources and training to keep
                  improving your skills and knowledge.
                </p>
              </div>
            </div>
            <div className="flex items-center p-4 border rounded-lg shadow-sm bg-white">
              <span className="text-2xl mr-4">🤝</span>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Collaborative Opportunities
                </h2>
                <p className="text-gray-600">
                  Engage in collaborative opportunities with other entrepreneurs
                  to create mutually beneficial partnerships.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="md:w-1/3 p-6 bg-lime-300 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
            Quick Register
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 font-medium">
                Service Name
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded text-gray-800"
                placeholder="Enter your business name"
                name="service_name"
                onChange={handleChange}
                value={formData.service_name}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Type</label>
              <select
                id="type"
                className="w-full p-2 border rounded text-gray-800"
                value={formData.type}
                name="type"
                onChange={handleChange}
              >
                <option value="Services">Services</option>
                <option value="Consulting">Consulting</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium ">
                Years Of Industry Excellence
              </label>
              <input
                className="w-full p-2 border rounded text-gray-800"
                step="1"
                min="0"
                type="number"
                name="years_of_excellence"
                placeholder="Enter years of experience"
                onChange={handleChange}
                value={formData.years_of_excellence}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed text-gray-800"
                placeholder="Enter your email"
                value={email || ""}
                name="email"
                id="email"
                readOnly
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">
                Contact Number
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded text-gray-800"
                placeholder="Enter your Mobile Number"
                id="contactNumber"
                name="contact_number"
                onChange={handleChange}
                value={formData.contact_number}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Address</label>
              <input
                type="text"
                className="w-full p-2 border rounded text-gray-800"
                placeholder="Enter your business Address"
                name="address"
                onChange={handleChange}
                value={formData.address}
              />
            </div>
            {/* Multiple Services Selection */}
            <div className="space-y-4 ">
              <label className="block text-gray-700 font-medium">
                Select Services
              </label>
              <div className="space-y-2 grid grid-cols-2 md:grid-cols-2 gap-4">
                <div className="items-center">
                  <input
                    type="checkbox"
                    id="tech-solutions"
                    value="Technology Solutions"
                    checked={selectedServices.includes("Technology Solutions")}
                    onChange={handleCheckboxChange}
                    className="mr-2 text-gray-800"
                  />
                  <label
                    htmlFor="tech-solutions"
                    className="text-gray-500 font-serif text-sm"
                  >
                    Technology Solutions
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="marketing-services"
                    value="Marketing Services"
                    checked={selectedServices.includes("Marketing Services")}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <label
                    htmlFor="marketing-services"
                    className="text-gray-500 font-serif text-sm"
                  >
                    Marketing Services
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="financial-consulting"
                    value="Financial Consulting"
                    checked={selectedServices.includes("Financial Consulting")}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <label
                    htmlFor="financial-consulting"
                    className="text-gray-500 font-serif text-sm"
                  >
                    Financial Consulting
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="branding"
                    value="Branding"
                    checked={selectedServices.includes("Branding")}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <label
                    htmlFor="branding"
                    className="text-gray-500 font-serif text-sm"
                  >
                    Branding
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="web-development"
                    value="Web Development"
                    checked={selectedServices.includes("Web Development")}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <label
                    htmlFor="web-development"
                    className="text-gray-500 font-serif text-sm"
                  >
                    Web Development
                  </label>
                </div>

                {/* Additional Services */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="seo-services"
                    value="SEO Services"
                    checked={selectedServices.includes("SEO Services")}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <label
                    htmlFor="seo-services"
                    className="text-gray-500 font-serif text-sm"
                  >
                    SEO Services
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="content-writing"
                    value="Content Writing"
                    checked={selectedServices.includes("Content Writing")}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <label
                    htmlFor="content-writing"
                    className="text-gray-500 font-serif text-sm"
                  >
                    Content Writing
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="app-development"
                    value="App Development"
                    checked={selectedServices.includes("App Development")}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <label
                    htmlFor="app-development"
                    className="text-gray-500 font-serif text-sm"
                  >
                    App Development
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="graphic-design"
                    value="Graphic Design"
                    checked={selectedServices.includes("Graphic Design")}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <label
                    htmlFor="graphic-design"
                    className="text-gray-500 font-serif text-sm"
                  >
                    Graphic Design
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="video-production"
                    value="Video Production"
                    checked={selectedServices.includes("Video Production")}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <label
                    htmlFor="video-production"
                    className="text-gray-500 font-serif text-sm"
                  >
                    Video Production
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="business-registrations"
                    value="Business Registrations"
                    checked={selectedServices.includes("Business Registrations")}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <label
                    htmlFor="business-registrations"
                    className="text-gray-500 font-serif text-sm"
                  >
                    Business Registrations
                  </label>
                </div>
              </div>
            </div>

            <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}