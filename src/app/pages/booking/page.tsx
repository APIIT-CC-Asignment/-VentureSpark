"use client";

import { useState, useEffect, FormEvent, ReactNode } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import HeaderContent from "../../components/HeaderContent/headercontent";
import FooterContent from "@/app/components/FooterContent/footercontent";

type ConsultantType = "finance" | "legal" | "business" | "";

type Consultant = {
  id: string;
  name: string;
  type: ConsultantType;
  description: string;
  image?: string;
};

type Service = {
  id: string;
  name: string;
  type: "Services";
  selectedservice: string;
  description: string;
  years_of_excellence: string;
  image?: string;
};

type BookableResource = Consultant | Service;

export default function BookingPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    if (email) {
      setFormData(prev => ({ ...prev, email }));
    }
    if (name) {
      setFormData(prev => ({ ...prev, name }));
    }
  }, [email, name]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setEmail(localStorage.getItem("email"));
      setName(localStorage.getItem("name"));
    }
  }, []);

  const [selectedResource, setSelectedResource] =
    useState<BookableResource | null>(null);

  useEffect(() => {
    if (selectedResource?.name) {
      setFormData((prev) => ({ ...prev, servicename: selectedResource?.name }));
    }
  }, [selectedResource?.name]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    message: "",
    servicename: selectedResource?.name || ""
  });

  const [minDate, setMinDate] = useState<string>("");

  // Set minimum date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setMinDate(today);
  }, []);

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const response = await fetch("/api/getConsultants", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        const consultantsWithImages = data.map((consultant: Consultant) => ({
          ...consultant,
          image: "/images/face.jpg",
        }));

        setConsultants(consultantsWithImages);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch consultants"
        );
        console.error("Error fetching consultants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultants();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/getServices", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        const servicesWithImages = data.map((service: Service) => ({
          ...service,
          image: "/images/Service.jpg",
        }));

        setServices(servicesWithImages);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch services"
        );
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const [status, setStatus] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Submitting...");

    try {
      const response = await fetch("/api/postbooking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("Booked successfully!");
        alert("Booked successfully!");
        setFormData({ name: "", email: "", date: "", message: "", servicename: "" });
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

  const scrollToForm = (resource: BookableResource) => {
    setSelectedResource(resource);
    document
      .getElementById("booking-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const parseServiceList = (serviceListString: string): string[] => {
    if (!serviceListString) return [];
    return serviceListString.split(",").map((item) => item.trim());
  };

  const isService = (resource: BookableResource): resource is Service => {
    return resource.type === "Services";
  };

  return (
    <div className="font-sans bg-gray-50">
      <HeaderContent />

      {/* Banner Section */}
      <motion.section
        id="banner"
        className="pt-50 pb-20 text-center bg-gradient-to-b from-[#1E3A8A] to-[#10B981]"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold text-white max-w-4xl mx-auto mb-6"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Elevate Your Startup
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl max-w-2xl mx-auto mb-10 text-white/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Partner with experts to drive your success.
        </motion.p>
        <motion.a
          href="#consultants"
          className="inline-block bg-[#F59E0B] text-white px-10 py-4 rounded-full font-semibold text-lg shadow-md"
          whileHover={{
            scale: 1.1,
            boxShadow: "0 6px 20px rgba(245, 158, 11, 0.4)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          Discover Experts
        </motion.a>
      </motion.section>

      {/* Consultants Section */}
      <section
        id="consultants"
        className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.h2
          className="text-4xl font-bold text-[#1E3A8A] mb-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Meet Your Growth Partners
        </motion.h2>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-xl text-[#1E3A8A]">Loading consultants...</div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-xl text-red-500">
              Failed to load consultants. Please try again later.
            </div>
          </div>
        ) : (
          ["finance", "legal", "business"].map((type, index) => {
            const filteredConsultants = consultants.filter(
              (c) => c.type === type
            );

            if (filteredConsultants.length === 0) return null;

            return (
              <motion.div
                key={type}
                className="mb-16"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <h3 className="text-3xl font-semibold text-[#1E3A8A] mb-8 capitalize">
                  {type} Expertise
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {filteredConsultants.map((consultant) => (
                    <motion.div
                      key={consultant.id}
                      className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 8px 25px rgba(30, 58, 138, 0.15)",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image
                        src={consultant.image || "/images/face.jpg"}
                        alt={consultant.name}
                        width={150}
                        height={150}
                        className="rounded-full mx-auto mb-6 border-4 border-[#10B981]/20"
                      />
                      <h4 className="text-xl font-semibold text-[#1E3A8A]">
                        {consultant.name}
                      </h4>
                      <p className="text-gray-600 mb-6">
                        {consultant.description}
                      </p>
                      <motion.button
                        onClick={() => scrollToForm(consultant)}
                        className="w-full bg-[#10B981] text-white px-4 py-3 rounded-full font-medium"
                        whileHover={{ scale: 1.05, backgroundColor: "#059669" }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        Schedule Now
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })
        )}
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.h2
          className="text-4xl font-bold text-[#1E3A8A] mb-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Our Services
        </motion.h2>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-xl text-[#1E3A8A]">Loading services...</div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-xl text-red-500">
              Failed to load services. Please try again later.
            </div>
          </div>
        ) : (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service) => {
                // Parse service list
                const serviceList = parseServiceList(service.selectedservice);

                return (
                  <motion.div
                    key={service.id}
                    className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 8px 25px rgba(30, 58, 138, 0.15)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={service.image || "/images/Service.jpg"}
                      alt={service.name}
                      width={150}
                      height={150}
                      className="rounded-full mx-auto mb-6 border-4 border-[#10B981]/20"
                    />
                    <h4 className="text-xl font-semibold text-[#1E3A8A] mb-2">
                      {service.name}
                    </h4>
                    <span className="block text-gray-600 mb-4">
                      Year Of Excellence: {service.years_of_excellence}
                    </span>
                    <div className="mb-6">
                      <h5 className="font-medium text-gray-700 mb-2">
                        Services Offered:
                      </h5>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        {serviceList && serviceList.length > 0 ? (
                          serviceList.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))
                        ) : (
                          <li>No services available</li>
                        )}
                      </ul>
                    </div>

                    <motion.button
                      onClick={() => scrollToForm(service)}
                      className="w-full bg-[#10B981] text-white px-4 py-3 rounded-full font-medium"
                      whileHover={{ scale: 1.05, backgroundColor: "#059669" }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      Schedule Now
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </section>

      {/* Booking Form - FIXED INPUT VISIBILITY */}
      {email && email.length > 0 ? (
        selectedResource && (
          <motion.section
            id="booking-form"
            className="py-20 bg-white"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl font-bold text-[#1E3A8A] mb-10 text-center">
                Book {selectedResource.name}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="servicename"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Selected Service
                  </label>
                  <input
                    type="text"
                    id="servicename"
                    name="servicename"
                    value={selectedResource.name}
                    onChange={handleChange}
                    className="w-full px-5 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all"
                    readOnly
                  />
                </div>

                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name || (name || "")}
                    onChange={handleChange}
                    className="w-full px-5 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email || (email || "")}
                    onChange={handleChange}
                    className="w-full px-5 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all"
                    readOnly
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={minDate}
                    className="w-full px-5 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Needs
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-5 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about your goals and what you want to achieve..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={status === "Submitting..."}
                  className="w-full bg-[#F59E0B] text-white px-6 py-4 rounded-full font-semibold text-lg shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                  whileHover={{
                    scale: status === "Submitting..." ? 1 : 1.05,
                    boxShadow: status === "Submitting..." ? "0 4px 12px rgba(245, 158, 11, 0.3)" : "0 6px 20px rgba(245, 158, 11, 0.3)",
                  }}
                  whileTap={status === "Submitting..." ? {} : { scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {status === "Submitting..." ? "Processing..." : "Lock in Your Session"}
                </motion.button>

                {status && (
                  <div className={`text-center p-3 rounded-lg ${status.includes("Error")
                    ? "bg-red-50 text-red-700"
                    : status.includes("successful")
                      ? "bg-green-50 text-green-700"
                      : "bg-blue-50 text-blue-700"
                    }`}>
                    {status}
                  </div>
                )}
              </form>
            </div>
          </motion.section>
        )
      ) : (
        <div id="booking-form" className="py-20 bg-white">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-2xl text-red-600 font-semibold mb-6">
              Please sign up to book an appointment.
            </p>
            <p className="text-gray-600">
              You need to be logged in to schedule a consultation with our experts.
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <FooterContent />
    </div>
  );
}