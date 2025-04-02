"use client";
import FooterContent from "@/app/components/FooterContent/footercontent";
import HeaderContent from "@/app/components/HeaderContent/headercontent";
import { useState, useEffect } from "react";

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
    expertise_in: ""
  });

  useEffect(() => {
    
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
      if (localStorage.getItem("email") != null) {
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
            expertise_in: ""
          });
          setSelectedServices([]);
        } else {
          if (response.status === 409) {
            alert(data.message);
          } else {
            alert(`Error: ${data.message}`);
          }
        }
      } else {
        alert("Please login to register");
      }
    } catch (error) {
      alert("Error: Could not connect to server");
    }
  };
    
  return (
    <div>
      <HeaderContent />
    
      <div className="flex flex-col md:flex-row gap-6 items-stretch justify-center bg-gray-100 px-4 py-24">
        <div className="w-full md:w-1/2 p-6 bg-white rounded-lg shadow-md flex flex-col mt-8 md:mt-0">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 font-Positivus text-black">
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
          <div className="mt-6 space-y-4 flex-grow">
            {[
              { emoji: "🌍", title: "Expand your Reach", description: "Connect with a growing network of ambitious entrepreneurs and scale your service business." },
              { emoji: "➕", title: "Qualified Leads", description: "Access pre-qualified clients who are actively seeking your expertise and services." },
              { emoji: "💼", title: "Business Growth", description: "Leverage the platform's tools and resources to accelerate the growth of your business." },
              { emoji: "📊", title: "Analytics and Insights", description: "Gain valuable insights into your business performance and make data-driven decisions." },
              { emoji: "💡", title: "Expert Guidance", description: "Receive expert guidance from industry professionals to help you overcome challenges and achieve success." },
              { emoji: "🌱", title: "Continuous Learning", description: "Access a library of educational resources and training to keep improving your skills and knowledge." },
              { emoji: "🤝", title: "Collaborative Opportunities", description: "Engage in collaborative opportunities with other entrepreneurs to create mutually beneficial partnerships." }
            ].map((benefit, index) => (
              <div key={index} className="flex items-center p-3 md:p-4 border rounded-lg shadow-sm bg-white">
                <span className="text-xl md:text-2xl mr-3 md:mr-4">{benefit.emoji}</span>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800">{benefit.title}</h2>
                  <p className="text-sm md:text-base text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
    
        {/* Right Section */}
        <div className="w-full md:w-1/3 p-6 bg-lime-300 rounded-lg shadow-md flex flex-col mt-8 md:mt-0">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-center text-gray-800">
            Quick Register
          </h2>
          <form className="space-y-4 flex-grow" onSubmit={handleSubmit}>
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
                <option value="finance">Finance Consulting</option>
                <option value="legal">Legal Consulting</option>
                <option value="business">Business Consulting</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium">
              Expertise In
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded text-gray-800"
                placeholder="Expertise In"
                name="expertise_in"
                onChange={handleChange}
                value={formData.expertise_in}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">
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
            <div className="space-y-3">
              <label className="block text-gray-700 font-medium">Select Services</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: "tech-solutions", label: "Technology Solutions" },
                  { id: "marketing-services", label: "Marketing Services" },
                  { id: "financial-consulting", label: "Financial Consulting" },
                  { id: "branding", label: "Branding" },
                  { id: "web-development", label: "Web Development" },
                  { id: "seo-services", label: "SEO Services" },
                  { id: "content-writing", label: "Content Writing" },
                  { id: "app-development", label: "App Development" },
                  { id: "graphic-design", label: "Graphic Design" },
                  { id: "video-production", label: "Video Production" },
                  { id: "business-registrations", label: "Business Registrations" },
                  { id: "tex-consulting", label: "Tex Consulting" },
                  { id: "legalservices", label: "Legal Services" },
                  { id: "HRservices", label: "Human Resources (HR) Services" },
                ].map((service, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      id={service.id}
                      value={service.label}
                      checked={selectedServices.includes(service.label)}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    <label htmlFor={service.id} className="text-gray-500 text-sm">
                      {service.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
    
            <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 mt-4">
              Register
            </button>
          </form>
        </div>
      </div>
      <FooterContent />
    </div>
  );
}