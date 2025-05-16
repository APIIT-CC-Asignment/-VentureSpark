'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiEdit, FiSettings, FiCalendar, FiUser, 
  FiMail, FiPhone, FiChevronRight, FiX, 
  FiCheck, FiPlus, FiAlertCircle, FiClock,
  FiArrowLeft
} from 'react-icons/fi';

type UserData = {
  id: number;
  username: string;
  email: string;
  phone?: string;
  typegroup: string;
  createdAt: string;
};

type Booking = {
  id: number;
  service: string;
  date: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
};

type PasswordData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type Notifications = {
  email: boolean;
  sms: boolean;
  promotions: boolean;
};

export default function UserProfile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState<Notifications>({
    email: true,
    sms: true,
    promotions: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const email = localStorage.getItem('email');
        if (!email) {
          router.push('/pages/loginpage');
          return;
        }

        const userResponse = await fetch(`/api/users?email=${encodeURIComponent(email)}`);
        if (!userResponse.ok) {
          throw new Error(`Failed to fetch user data: ${userResponse.status}`);
        }
        
        const userData = await userResponse.json();
        if (!userData || !userData.id) {
          throw new Error('Invalid user data received');
        }
        
        setUserData(userData);

        const bookingsResponse = await fetch(`/api/bookings?email=${encodeURIComponent(email)}`);
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          setBookings(bookingsData);
        }

      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userData) return;
    
    const { name, value } = e.target;
    setUserData(prev => ({
      ...(prev as UserData),
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (!userData) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      if (userData.email !== localStorage.getItem('email')) {
        localStorage.setItem('email', userData.email);
      }

      setIsEditing(false);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords don't match!");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData?.email || localStorage.getItem('email'),
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update password');
      }

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationToggle = (type: keyof Notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const cancelBooking = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'cancelled'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      setBookings(prev => prev.map(booking => 
        booking.id === id ? { ...booking, status: 'cancelled' } : booking
      ));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to cancel booking');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <FiAlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">Error Loading Profile</h2>
          <p className="mt-2 text-gray-600">
            {error.includes('404') ? 'User account not found' : error}
          </p>
          <div className="mt-6 space-y-3">
            <button
              onClick={() => {
                localStorage.removeItem('email');
                localStorage.removeItem('token');
                router.push('/pages/loginpage');
              }}
              className="w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
            >
              Log In Again
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <FiUser className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">No User Data Found</h2>
          <p className="mt-2 text-gray-600">Please log in to view your profile.</p>
          <button
            onClick={() => router.push('/pages/loginpage')}
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[#1E3A8A] to-[#10B981] text-white p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-2"
            aria-label="Go back"
          >
            <FiArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h3 className="text-white">User Panel</h3>
        </h2>
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left p-2 rounded-lg transition-colors ${
              activeTab === 'profile' ? 'bg-teal-500' : 'hover:bg-teal-500'
            }`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`w-full text-left p-2 rounded-lg transition-colors ${
              activeTab === 'bookings' ? 'bg-teal-500' : 'hover:bg-teal-500'
            }`}
          >
            Bookings
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left p-2 rounded-lg transition-colors ${
              activeTab === 'settings' ? 'bg-teal-500' : 'hover:bg-teal-500'
            }`}
          >
            Settings
          </button>
        </nav>
        
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-6">
        <header className="bg-white p-4 rounded-lg shadow mb-6">
          <h1 className="text-2xl font-bold text-blue-900">User Profile Dashboard</h1>
        </header>
        <div className="bg-white p-6 rounded-lg shadow">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                {isEditing ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={handleSaveProfile}
                      className="flex items-center bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                      disabled={loading}
                    >
                      {loading ? (
                        <FiClock className="mr-2 animate-spin" />
                      ) : (
                        <FiCheck className="mr-2" />
                      )}
                      Save
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="flex items-center bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      <FiX className="mr-2" />
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleEditProfile}
                    className="flex items-center text-teal-600 hover:text-teal-800 transition-colors"
                  >
                    <FiEdit className="mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-start">
                  <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Username</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="username"
                        value={userData.username}
                        onChange={handleInputChange}
                        className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                        disabled={loading}
                      />
                    ) : (
                      <p className="mt-1 text-lg font-medium text-gray-800">{userData.username}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                        disabled={loading}
                      />
                    ) : (
                      <p className="mt-1 text-lg font-medium text-gray-800 flex items-center">
                        <FiMail className="mr-2 text-gray-500" />
                        {userData.email}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Account Type</label>
                    <p className="mt-1 text-lg font-medium text-gray-800 capitalize">{userData.typegroup.toLowerCase()}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Member Since</label>
                    <p className="mt-1 text-lg font-medium text-gray-800">
                      {new Date(userData.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">My Bookings</h2>
                <button 
                  className="flex items-center bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                  onClick={() => router.push('/pages/booking')}
                >
                  <FiPlus className="mr-2" />
                  New Booking
                </button>
              </div>
              
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map(booking => (
                    <div key={booking.id} className="border border-gray-100 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{booking.service}</h3>
                          <div className="flex items-center mt-2 text-gray-600">
                            <FiCalendar className="mr-2" />
                            <span>{new Date(booking.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 md:mt-0 flex items-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            booking.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : booking.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                          {['pending', 'confirmed'].includes(booking.status) && (
                            <button 
                              onClick={() => cancelBooking(booking.id)}
                              className="ml-4 text-red-600 hover:text-red-800 transition-colors flex items-center"
                              disabled={loading}
                            >
                              {loading ? (
                                <FiClock className="animate-spin" />
                              ) : (
                                <>
                                  Cancel <FiX className="ml-1" />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">You don't have any bookings yet</p>
                  <button 
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors"
                    onClick={() => router.push('/pages/booking')}
                  >
                    Book a Service
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Account Settings</h2>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-start">
                  <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Current Password</label>
                      <input 
                        type="password" 
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors" 
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
                      <input 
                        type="password" 
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors" 
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Confirm New Password</label>
                      <input 
                        type="password" 
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors" 
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <button 
                    onClick={handleUpdatePassword}
                    className="mt-4 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors"
                    disabled={loading}
                  >
                    {loading ? (
                      <FiClock className="animate-spin mx-auto" />
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </div>
                
                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input 
                        type="checkbox" 
                        checked={notifications.email}
                        onChange={() => handleNotificationToggle('email')}
                        className="h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500" 
                      />
                      <span className="text-gray-700">Email Notifications</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input 
                        type="checkbox" 
                        checked={notifications.sms}
                        onChange={() => handleNotificationToggle('sms')}
                        className="h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500" 
                      />
                      <span className="text-gray-700">SMS Notifications</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input 
                        type="checkbox" 
                        checked={notifications.promotions}
                        onChange={() => handleNotificationToggle('promotions')}
                        className="h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500" 
                      />
                      <span className="text-gray-700">Promotional Offers</span>
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Danger Zone</h3>
                  <button 
                    className="text-red-600 border border-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                        // Handle account deletion
                      }
                    }}
                  >
                    Delete My Account
                  </button>
                  <p className="mt-2 text-sm text-gray-500">This action cannot be undone. All your data will be permanently deleted.</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}