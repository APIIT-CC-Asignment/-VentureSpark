// File: app/components/ConsultantDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useRouter } from 'next/navigation';

interface VendorProfile {
  id: string;
  name: string;
  email: string;
  expertise: string;
  bio: string;
  hourly_rate: number;
}

interface Availability {
  id: string;
  vendor_id: string;
  start_time: string;
  end_time: string;
}

const ConsultantDashboard: React.FC = () => {
  const [profile, setProfile] = useState<VendorProfile>({
    id: '',
    name: '',
    email: '',
    expertise: '',
    bio: '',
    hourly_rate: 0,
  });
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const router = useRouter();

  // Replace with actual vendor ID from auth context
  const vendorId = '1';

  useEffect(() => {
    fetchProfile();
    fetchAvailability();
  }, []);

  const fetchProfile = async () => {
    const response = await fetch(`/api/vendor/profile?vendorId=${vendorId}`);
    const data = await response.json();
    setProfile(data);
  };

  const fetchAvailability = async () => {
    const response = await fetch(`/api/vendor/availability?vendorId=${vendorId}`);
    const data = await response.json();
    setAvailability(data);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/vendor/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (response.ok) {
      alert('Profile updated successfully');
    }
  };

  const handleAvailabilitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/vendor/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vendorId,
        startTime: `${selectedDate.toISOString().split('T')[0]} ${startTime}:00`,
        endTime: `${selectedDate.toISOString().split('T')[0]} ${endTime}:00`,
      }),
    });
    if (response.ok) {
      fetchAvailability();
      setStartTime('');
      setEndTime('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-teal-500">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-white mb-6">Consultant Dashboard</h1>
          
          {/* Profile Section */}
          <div className="bg-white bg-opacity-90 shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">Profile Management</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-900">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="text-black mt-1 block w-full rounded-md border-teal-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-900">Expertise</label>
                <input
                  type="text"
                  value={profile.expertise}
                  onChange={(e) => setProfile({ ...profile, expertise: e.target.value })}
                  className="text-black mt-1 block w-full rounded-md border-teal-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-900">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="text-black mt-1 block w-full rounded-md border-teal-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-900">Hourly Rate ($)</label>
                <input
                  type="number"
                  value={profile.hourly_rate}
                  onChange={(e) => setProfile({ ...profile, hourly_rate: parseFloat(e.target.value) })}
                  className="text-black mt-1 block w-full rounded-md border-teal-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                />
              </div>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300"
              >
                Save Profile
              </button>
            </form>
          </div>

          {/* Availability Section */}
          <div className="bg-white bg-opacity-90 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">Set Availability</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Calendar
                  //onChange={setSelectedDate}
                  value={selectedDate}
                  className="rounded-md border-teal-300 shadow-sm"
                />
              </div>
              <div>
                <form onSubmit={handleAvailabilitySubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-900">Start Time</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="mt-1 block w-full rounded-md border-teal-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-900">End Time</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="mt-1 block w-full rounded-md border-teal-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300"
                  >
                    Add Availability
                  </button>
                </form>

                <div className="mt-6">
                  <h3 className="text-lg font-medium text-blue-900">Current Availability</h3>
                  <ul className="mt-2 divide-y divide-teal-200">
                    {availability.map((slot) => (
                      <li key={slot.id} className="py-2 text-blue-900">
                        {new Date(slot.start_time).toLocaleString()} -{' '}
                        {new Date(slot.end_time).toLocaleString()}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantDashboard;