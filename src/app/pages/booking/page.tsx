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

type AvailabilitySlot = {
  id: string;
  vendor_id: string | number;
  start_time: string;
  end_time: string;
  created_at?: string;
  updated_at?: string;
  is_booked?: boolean;
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
  const [typegroup, setGroup] = useState<string | null>(null);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  useEffect(() => {
    if (email) {
      setFormData(prev => ({ ...prev, email }));
    }
    if (name) {
      setFormData(prev => ({ ...prev, name }));
    }
  }, [email]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setEmail(localStorage.getItem("email"));
      setName(localStorage.getItem("username"));
      setGroup(localStorage.getItem("typegroup"));
    }
  }, []);

  const [selectedResource, setSelectedResource] =
    useState<BookableResource | null>(null);

  useEffect(() => {
    if (selectedResource?.name) {
      setFormData((prev) => ({ ...prev, servicename: selectedResource?.name }));
    }

    // Clear any previously selected slots when resource changes
    setSelectedSlot(null);
    setAvailabilitySlots([]);

    // Fetch availability slots when a service is selected
    if (selectedResource && isService(selectedResource)) {
      // First fetch vendor details to ensure we have the correct vendor ID
      fetchVendorDetails(selectedResource.id)
        .then(vendorData => {
          if (vendorData && vendorData.id) {
            fetchAvailabilitySlots(vendorData.id);
          } else {
            throw new Error('Invalid vendor data');
          }
        })
        .catch(error => {
          console.error('[booking] Error in vendor details flow:', error);
          setSlotsError('Unable to fetch vendor availability. Please try again later.');
        });
    }
  }, [selectedResource?.name, selectedResource?.id]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    message: "",
    servicename: selectedResource?.name || "",
    slotId: ""
  });
  const [minDate, setMinDate] = useState<string>("");

  // Function to fetch availability slots for a service
  const fetchAvailabilitySlots = async (vendorId: string) => {
    if (!vendorId) return;

    setLoadingSlots(true);
    setSlotsError(null);

    try {
      console.log(`[booking] Fetching availability slots for vendor ID: ${vendorId}`);
      const response = await fetch(`/api/vendor-availability?vendorId=${encodeURIComponent(vendorId)}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log(`[booking] Found ${data.length} availability slots`);

      // Filter out slots that have already passed and ensure proper date formatting
      const now = new Date();
      const validSlots = data.filter((slot: AvailabilitySlot) => {
        try {
          const slotTime = new Date(slot.start_time);
          return slotTime > now && !slot.is_booked;
        } catch (error) {
          console.error('[booking] Error processing slot:', error);
          return false;
        }
      }).map((slot: AvailabilitySlot) => ({
        ...slot,
        start_time: new Date(slot.start_time).toISOString(),
        end_time: new Date(slot.end_time).toISOString()
      }));

      // Sort slots by start time
      validSlots.sort((a: AvailabilitySlot, b: AvailabilitySlot) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );

      setAvailabilitySlots(validSlots);
    } catch (err) {
      console.error("[booking] Error fetching availability slots:", err);
      setSlotsError(err instanceof Error ? err.message : "Failed to fetch availability slots");
    } finally {
      setLoadingSlots(false);
    }
  };

  // Add this function to handle vendor details fetching
  const fetchVendorDetails = async (vendorId: string) => {
    try {
      const response = await fetch(`/api/vendor?vendorId=${encodeURIComponent(vendorId)}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch vendor details: ${response.status}`);
      }

      const data = await response.json();

      if (!data || !data.id) {
        throw new Error('Invalid vendor data received');
      }

      return data;
    } catch (error) {
      console.error('[booking] Error fetching vendor details:', error);
      throw error;
    }
  };

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
        console.log("[booking] Fetching services...");
        setLoading(true);

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
        console.log("[booking] Services API response:", data);

        if (!data || !Array.isArray(data)) {
          console.error("[booking] Invalid data format from services API", data);
          throw new Error("Invalid data from services API");
        }

        // Check if we got any services
        if (data.length === 0) {
          console.log("[booking] No services returned from API, setting empty array");
          setServices([]);
        } else {
          console.log(`[booking] Processing ${data.length} services`);

          const servicesWithImages = data.map((service: Service) => ({
            ...service,
            image: "/images/Service.jpg",
          }));

          console.log("[booking] Setting services with images");
          setServices(servicesWithImages);
        }
      } catch (err) {
        console.error("[booking] Error fetching services:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch services"
        );
        // Set empty array to prevent UI from breaking
        setServices([]);
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

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlot(slotId);
    setFormData({ ...formData, slotId });
    // Clear the date field since we're using a specific slot
    setFormData(prev => ({ ...prev, date: "" }));
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
        setStatus("Booked successful!");
        alert("Booked successful!");
        setFormData({ name: "", email: "", date: "", message: "", servicename: "", slotId: "" });
        setSelectedSlot(null);
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
    if (!serviceListString) return ['General Services'];
    try {
      // Check if it's a JSON array first
      if (serviceListString.trim().startsWith('[')) {
        const parsed = JSON.parse(serviceListString);
        if (Array.isArray(parsed)) {
          return parsed.map(item => item.toString().trim()).filter(Boolean);
        }
      }

      // Otherwise treat as comma-separated list
      return serviceListString.split(",")
        .map(item => item.trim())
        .filter(item => item.length > 0);
    } catch (e) {
      console.error("[booking] Error parsing service list:", e);
      return ['General Services'];
    }
  };

  // Format date for display
  const formatSlotDate = (dateTimeString: string): string => {
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('[booking] Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Format time for display
  const formatSlotTime = (dateTimeString: string): string => {
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid time');
      }
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('[booking] Error formatting time:', error);
      return 'Invalid time';
    }
  };

  // Group slots by date for better display
  const groupedSlots = () => {
    const groups: { [key: string]: AvailabilitySlot[] } = {};

    availabilitySlots.forEach(slot => {
      try {
        const dateKey = formatSlotDate(slot.start_time);
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(slot);
      } catch (error) {
        console.error('[booking] Error processing slot for grouping:', error);
      }
    });

    // Sort slots within each day by time
    Object.keys(groups).forEach(date => {
      groups[date].sort((a, b) => {
        try {
          return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
        } catch (error) {
          console.error('[booking] Error sorting slots:', error);
          return 0;
        }
      });
    });

    return groups;
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


      {typegroup === "client" && (
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
      )}

      {typegroup === "client" && (
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
              <div className="text-sm mt-4 text-gray-500">{error}</div>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-xl text-[#1E3A8A]">No services available at this time.</div>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-[#10B981] text-white rounded-full"
                >
                  Refresh Page
                </button>
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
                        src={service.image || "/images/face.jpg"}
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
      )}

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
                    className="w-full px-5 py-3 rounded-lg border border-[#1E3A8A]/20 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all"
                    required
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
                    value={name || ""}
                    onChange={handleChange}
                    className="w-full px-5 py-3 rounded-lg border border-[#1E3A8A]/20 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all"
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
                    value={email || ""}
                    name="email"
                    id="email"
                    readOnly
                    onChange={handleChange}
                    className="w-full px-5 py-3 rounded-lg border border-[#1E3A8A]/20 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all"
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
                    className="w-full px-5 py-3 rounded-lg border border-[#1E3A8A]/20 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all"
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
                    className="w-full px-5 py-3 rounded-lg border border-[#1E3A8A]/20 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all"
                    placeholder="What do you want to achieve?"
                  />
                </div>

                <motion.button
                  type="submit"
                  className="w-full bg-[#F59E0B] text-white px-6 py-4 rounded-full font-semibold text-lg shadow-md"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 6px 20px rgba(245, 158, 11, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {status === "Submitting..." ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Book Now"
                  )}
                </motion.button>
              </form>
            </div>
          </motion.section>
        )
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Please log in to book a service.
          </h2>
          <a
            href="/pages/loginpage"
            className="inline-block bg-[#1E3A8A] text-white px-8 py-3 rounded-full hover:bg-blue-800 transition-colors"
          >
            Log In
          </a>
        </div>
      )}
      <FooterContent />
    </div>
  );
}

