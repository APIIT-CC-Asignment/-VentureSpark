"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  AlertCircleIcon,
  LogOutIcon,
  UserIcon,
  BuildingIcon,
  CalendarIcon,
  ClockIcon,
  LinkIcon,
  AwardIcon,
  BarChart3Icon,
  MessageCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  SaveIcon,
  XIcon,
  MenuIcon,
  SearchIcon,
  TrendingUpIcon,
  DollarSignIcon,
  StarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MoreVerticalIcon
} from 'lucide-react';

// Updated interfaces based on actual table structure
interface VendorBasicInfo {
  id: number;
  username: string;
  email: string;
  typegroup: string;
  created_at: string;
  service_name: string;
  years_of_excellence: number;
  contact_number: string;
  address: string;
  selected_services: string;
  type: string;
  active: boolean;
  expertise_in: string;
}

interface VendorProfile {
  id: number | string;
  vendor_id: number | string;
  website_url: string;
  portfolio_documents: string;
  years_in_business: number;
  business_registration_number: string;
  tax_identification_number: string;
  social_media_links: string;
  certifications: string;
  profile_completion_percentage: number;
  verification_status: 'pending' | 'verified' | 'rejected';
  verification_notes: string;
  reviewed_by: number | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  isAuthenticated: boolean;
  vendorId: string | number;
  email: string;
}

const sidebarItems = [
  { id: 'dashboard', icon: <BuildingIcon className="w-5 h-5" />, label: 'Overview' },
  { id: 'profile', icon: <UserIcon className="w-5 h-5" />, label: 'Profile' },
  { id: 'availability', icon: <CalendarIcon className="w-5 h-5" />, label: 'Availability' },
  { id: 'sessions', icon: <ClockIcon className="w-5 h-5" />, label: 'Sessions' },
  { id: 'analytics', icon: <BarChart3Icon className="w-5 h-5" />, label: 'Analytics' },
  { id: 'reviews', icon: <MessageCircleIcon className="w-5 h-5" />, label: 'Reviews' }
];

const VendorDashboard: React.FC = () => {
  const router = useRouter();

  // Authentication state
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    vendorId: '',
    email: ''
  });

  // State for vendor data
  const [vendorInfo, setVendorInfo] = useState<VendorBasicInfo | null>(null);
  const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null);

  // UI states
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [dataLoaded, setDataLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState<VendorProfile | null>(null);

  // Helper function to format status
  const formatVerificationStatus = (status?: string) => {
    if (!status) return 'Pending';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Check for authentication on component mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('vendorAuth');
    const email = localStorage.getItem('email');

    console.log('Stored auth:', storedAuth); // Debug log
    console.log('Stored email:', email); // Debug log

    if (email && storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        console.log('Parsed auth:', parsedAuth); // Debug log
        setAuth({
          ...parsedAuth,
          isAuthenticated: true,
          email: email,
          vendorId: parsedAuth.vendorId || email
        });
        console.log('Final auth state will be:', {
          ...parsedAuth,
          isAuthenticated: true,
          email: email,
          vendorId: parsedAuth.vendorId || email
        }); // Debug log
      } catch (e) {
        console.error('Error parsing stored auth data', e);
        localStorage.removeItem('vendorAuth');
        router.push('/pages/loginpage');
      }
    } else if (email) {
      console.log('Only email found, creating auth with email as vendorId'); // Debug log
      setAuth({
        isAuthenticated: true,
        vendorId: email,
        email: email
      });
    } else {
      console.log('No auth data found, redirecting to signup'); // Debug log
      router.push('/pages/loginpage');
    }
  }, [router]);

  // Load data after authentication
  useEffect(() => {
    if (auth.isAuthenticated && auth.vendorId) {
      loadVendorData();
    }
  }, [auth.isAuthenticated, auth.vendorId]);

  const loadVendorData = async () => {
    setDataLoaded(false);
    try {
      await Promise.all([
        fetchVendorInfo(),
        fetchVendorProfile()
      ]);
      setDataLoaded(true);
    } catch (error) {
      console.error('Error loading data:', error);
      setFeedback({ type: 'error', message: 'Failed to load vendor data. Please try again.' });
    }
  };

  const fetchVendorInfo = async () => {
    try {
      console.log('Fetching vendor info for ID:', auth.vendorId); // Debug log
      console.log('Full URL:', `/api/vendor?vendorId=${auth.vendorId}`); // Debug log
      const response = await fetch(`/api/vendor?vendorId=${auth.vendorId}`);
      console.log('Response status:', response.status); // Debug log
      console.log('Response headers:', Object.fromEntries(response.headers.entries())); // Debug log

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          console.error('Failed to parse error response as JSON:', jsonError);
          errorData = { error: `HTTP ${response.status} ${response.statusText}` };
        }
        console.error('Error response:', errorData); // Debug log
        throw new Error(errorData.error || 'Failed to fetch vendor info');
      }

      const data = await response.json();
      console.log('Vendor info data:', data); // Debug log
      setVendorInfo(data);
    } catch (error) {
      console.error('Error fetching vendor info:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load vendor information.';
      setFeedback({ type: 'error', message: errorMessage });
    }
  };

  const fetchVendorProfile = async () => {
    try {
      // Using query parameter to match your API structure
      const response = await fetch(`/api/vendor-profile?vendorId=${auth.vendorId}`);

      if (response.ok) {
        const data = await response.json();
        setVendorProfile(data);
        setEditableProfile(data);
      } else if (response.status === 404) {
        // Profile doesn't exist, create default
        const defaultProfile: VendorProfile = {
          id: '',
          vendor_id: auth.vendorId,
          website_url: '',
          portfolio_documents: '[]',
          years_in_business: 0,
          business_registration_number: '',
          tax_identification_number: '',
          social_media_links: '{}',
          certifications: '[]',
          profile_completion_percentage: 0,
          verification_status: 'pending',
          verification_notes: '',
          reviewed_by: null,
          reviewed_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setVendorProfile(defaultProfile);
        setEditableProfile(defaultProfile);
      }
    } catch (error) {
      console.error('Error fetching vendor profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load vendor profile.';
      setFeedback({ type: 'error', message: errorMessage });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vendorAuth');
    localStorage.removeItem('email');
    setAuth({
      isAuthenticated: false,
      vendorId: '',
      email: ''
    });
    setDataLoaded(false);
    router.push('/pages/loginpage');
  };

  const calculateCompletionPercentage = () => {
    if (!vendorProfile) return 0;

    const fields = [
      vendorProfile.website_url,
      vendorProfile.business_registration_number,
      vendorProfile.tax_identification_number,
      vendorProfile.years_in_business > 0,
      vendorProfile.portfolio_documents !== '[]',
      vendorProfile.social_media_links !== '{}',
      vendorProfile.certifications !== '[]'
    ];

    const filledFields = fields.filter(field => field).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const getVerificationStatusDisplay = () => {
    if (!vendorProfile) return null;

    switch (vendorProfile.verification_status) {
      case 'verified':
        return (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircleIcon className="w-4 h-4 mr-1" />
              Verified
            </span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
              <XCircleIcon className="w-4 h-4 mr-1" />
              Verification Failed
            </span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              <ClockIcon className="w-4 h-4 mr-1" />
              Pending Verification
            </span>
          </div>
        );
    }
  };

  const handleProfileEdit = () => {
    setIsEditing(true);
  };

  const handleProfileSave = async () => {
    if (!editableProfile) return;

    setIsSubmitting(true);
    try {
      let url, method;

      if (editableProfile.id) {
        // Update existing profile
        url = `/api/vendor-profile`;
        method = 'PUT';
      } else {
        // Create new profile
        url = `/api/vendor-profile`;
        method = 'POST';
      }

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editableProfile)
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setVendorProfile(updatedProfile);
        setEditableProfile(updatedProfile);
        setIsEditing(false);
        setFeedback({ type: 'success', message: 'Profile updated successfully!' });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save profile. Please try again.';
      setFeedback({ type: 'error', message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileCancel = () => {
    setEditableProfile(vendorProfile);
    setIsEditing(false);
  };

  if (!auth.isAuthenticated) {
    return null;
  }

  if (!dataLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="w-12 h-12 bg-gradient-to-br from-[#B9FF66] to-[#8BC34A] rounded-lg mx-auto mb-4 flex items-center justify-center">
            <BuildingIcon className="w-6 h-6 text-black" />
          </div>
          <h2 className="text-xl font-bold text-center mb-4 text-black">Loading Dashboard...</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#B9FF66]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Enhanced Modern Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-white shadow-xl border-r border-gray-200 transition-all duration-300 ease-in-out relative`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className={`flex items-center ${sidebarOpen ? '' : 'justify-center'} transition-all duration-300`}>
              <div className="w-10 h-10 bg-gradient-to-br from-[#B9FF66] to-[#8BC34A] rounded-xl mr-3 flex items-center justify-center shadow-lg">
                <span className="text-lg font-bold text-black">V</span>
              </div>
              {sidebarOpen && <span className="text-xl font-bold text-black">Vendor Spark</span>}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-black transition-colors p-2 rounded-lg hover:bg-gray-100"
            >
              {sidebarOpen ? <ChevronLeftIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
            </button>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center p-4 rounded-xl transition-all duration-200 ${activeTab === item.id
                  ? 'bg-gradient-to-r from-[#B9FF66] to-[#8BC34A] text-black shadow-lg transform scale-105 font-semibold'
                  : 'text-black hover:bg-gray-100 hover:shadow-md'
                  }`}
              >
                <div className={`${activeTab === item.id ? 'scale-110' : ''} transition-transform duration-200`}>
                  {item.icon}
                </div>
                {sidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
                {!sidebarOpen && activeTab === item.id && (
                  <div className="absolute left-24 bg-gray-900 text-white px-3 py-1 rounded-md shadow-lg z-50">
                    <span className="text-sm whitespace-nowrap">{item.label}</span>
                    <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 border-r-4 border-r-gray-900 border-y-4 border-y-transparent"></div>
                  </div>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-4 text-black hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200"
          >
            <LogOutIcon className="w-5 h-5" />
            {sidebarOpen && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>

        {/* Expand Button when collapsed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute -right-4 top-8 bg-white shadow-lg border border-gray-200 p-2 rounded-full hover:shadow-xl transition-all"
          >
            <ChevronRightIcon className="w-4 h-4 text-black" />
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-20 flex items-center justify-between px-8">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-black">
              {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center space-x-6">
            <button className="p-3 text-black hover:bg-gray-100 rounded-lg transition-colors">
              <SearchIcon className="w-5 h-5" />
            </button>

            {vendorInfo && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-black">{vendorInfo.username}</p>
                  <p className="text-xs text-gray-600">{vendorInfo.email}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#B9FF66] to-[#8BC34A] rounded-full flex items-center justify-center text-black font-bold text-lg shadow-lg">
                  {vendorInfo.username.charAt(0).toUpperCase()}
                </div>
              </div>
            )}

            {getVerificationStatusDisplay()}

            <div className="relative bg-gray-100 rounded-lg p-3">
              <div className="w-36 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#B9FF66] to-[#8BC34A] transition-all duration-700 rounded-full"
                  style={{ width: `${calculateCompletionPercentage()}%` }}
                ></div>
              </div>
              <span className="absolute -top-6 right-0 text-xs font-semibold text-black">
                {calculateCompletionPercentage()}% Complete
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50 p-8">
          {feedback.message && (
            <div
              className={`mb-6 p-4 rounded-xl border ${feedback.type === 'error'
                ? 'bg-red-50 text-red-800 border-red-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                } animate-fadeIn shadow-sm`}
            >
              <div className="flex items-center">
                {feedback.type === 'error' ? (
                  <XCircleIcon className="w-5 h-5 mr-2" />
                ) : (
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                )}
                <span className="font-medium">{feedback.message}</span>
              </div>
            </div>
          )}

          {/* Dashboard Content */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-[#B9FF66] to-[#8BC34A] rounded-2xl p-8 text-black border border-gray-200 shadow-lg">
                <h2 className="text-3xl font-bold mb-2">
                  Welcome back, {vendorInfo?.username}! 👋
                </h2>
                <p className="text-lg font-medium">
                  Here's your vendor dashboard overview. Ready to grow your business?
                </p>
              </div>

              {/* Enhanced Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                      <BarChart3Icon className="w-7 h-7 text-blue-600" />
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">+12%</span>
                  </div>
                  <h3 className="text-sm font-semibold text-black mb-1">Profile Completion</h3>
                  <p className="text-3xl font-bold text-black">{calculateCompletionPercentage()}%</p>
                  <p className="text-xs text-gray-600 mt-1">Keep building your profile</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl flex items-center justify-center">
                      <CheckCircleIcon className="w-7 h-7 text-emerald-600" />
                    </div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">Status</span>
                  </div>
                  <h3 className="text-sm font-semibold text-black mb-1">Verification Status</h3>
                  <p className="text-3xl font-bold text-black">
                    {formatVerificationStatus(vendorProfile?.verification_status)}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Account verification</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl flex items-center justify-center">
                      <BuildingIcon className="w-7 h-7 text-purple-600" />
                    </div>
                    <span className="text-xs font-bold text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">Years</span>
                  </div>
                  <h3 className="text-sm font-semibold text-black mb-1">Business Experience</h3>
                  <p className="text-3xl font-bold text-black">{vendorProfile?.years_in_business || 0}+</p>
                  <p className="text-xs text-gray-600 mt-1">Years in business</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-black mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="flex items-center justify-center p-5 bg-gradient-to-r from-[#B9FF66] to-[#8BC34A] text-black rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                  >
                    <UserIcon className="w-5 h-5 mr-2" />
                    Complete Profile
                  </button>
                  <button
                    onClick={() => setActiveTab('availability')}
                    className="flex items-center justify-center p-5 bg-gray-100 text-black rounded-xl hover:bg-gray-200 transition-all shadow-md hover:shadow-lg font-semibold"
                  >
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    Set Availability
                  </button>
                  <button
                    onClick={() => setActiveTab('sessions')}
                    className="flex items-center justify-center p-5 bg-gray-100 text-black rounded-xl hover:bg-gray-200 transition-all shadow-md hover:shadow-lg font-semibold"
                  >
                    <ClockIcon className="w-5 h-5 mr-2" />
                    View Sessions
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Profile Tab */}
          {activeTab === 'profile' && vendorProfile && vendorInfo && (
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-black">Vendor Profile</h2>
                    <p className="text-gray-600 mt-2 text-lg">Manage your business information and profile details</p>
                  </div>
                  <div className="flex space-x-3">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleProfileCancel}
                          className="px-6 py-3 border-2 border-gray-300 rounded-xl text-black hover:bg-gray-50 font-semibold transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleProfileSave}
                          disabled={isSubmitting}
                          className="px-6 py-3 bg-gradient-to-r from-[#B9FF66] to-[#8BC34A] text-black rounded-xl hover:opacity-90 disabled:opacity-50 font-semibold shadow-lg"
                        >
                          {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleProfileEdit}
                        className="px-6 py-3 bg-gradient-to-r from-[#B9FF66] to-[#8BC34A] text-black rounded-xl hover:opacity-90 font-semibold shadow-lg"
                      >
                        <EditIcon className="w-4 h-4 inline mr-2" />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Basic Information */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-black border-b border-gray-200 pb-2">Basic Information</h3>

                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Username</label>
                      <input
                        type="text"
                        value={vendorInfo.username}
                        disabled
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-black font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Email</label>
                      <input
                        type="email"
                        value={vendorInfo.email}
                        disabled
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-black font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Service Name</label>
                      <input
                        type="text"
                        value={vendorInfo.service_name || ''}
                        disabled={!isEditing}
                        onChange={(e) => isEditing && setVendorInfo({ ...vendorInfo, service_name: e.target.value })}
                        placeholder="Enter your business name"
                        className={`w-full px-4 py-3 border border-gray-200 rounded-lg text-black font-medium ${isEditing ? 'focus:ring-2 focus:ring-[#B9FF66] focus:border-transparent bg-white' : 'bg-gray-50'}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Contact Number</label>
                      <input
                        type="text"
                        value={vendorInfo.contact_number || ''}
                        disabled={!isEditing}
                        onChange={(e) => isEditing && setVendorInfo({ ...vendorInfo, contact_number: e.target.value })}
                        placeholder="Enter contact number"
                        className={`w-full px-4 py-3 border border-gray-200 rounded-lg text-black font-medium ${isEditing ? 'focus:ring-2 focus:ring-[#B9FF66] focus:border-transparent bg-white' : 'bg-gray-50'}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Expertise</label>
                      <input
                        type="text"
                        value={vendorInfo.expertise_in || ''}
                        disabled={!isEditing}
                        onChange={(e) => isEditing && setVendorInfo({ ...vendorInfo, expertise_in: e.target.value })}
                        placeholder="e.g., Business Strategy, Marketing"
                        className={`w-full px-4 py-3 border border-gray-200 rounded-lg text-black font-medium ${isEditing ? 'focus:ring-2 focus:ring-[#B9FF66] focus:border-transparent bg-white' : 'bg-gray-50'}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Years of Excellence</label>
                      <input
                        type="number"
                        value={vendorInfo.years_of_excellence || 0}
                        disabled={!isEditing}
                        onChange={(e) => isEditing && setVendorInfo({ ...vendorInfo, years_of_excellence: parseInt(e.target.value) || 0 })}
                        placeholder="Years of experience"
                        className={`w-full px-4 py-3 border border-gray-200 rounded-lg text-black font-medium ${isEditing ? 'focus:ring-2 focus:ring-[#B9FF66] focus:border-transparent bg-white' : 'bg-gray-50'}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Address</label>
                      <textarea
                        value={vendorInfo.address || ''}
                        disabled={!isEditing}
                        onChange={(e) => isEditing && setVendorInfo({ ...vendorInfo, address: e.target.value })}
                        placeholder="Enter business address"
                        rows={3}
                        className={`w-full px-4 py-3 border border-gray-200 rounded-lg text-black font-medium ${isEditing ? 'focus:ring-2 focus:ring-[#B9FF66] focus:border-transparent bg-white' : 'bg-gray-50'}`}
                      />
                    </div>
                  </div>

                  {/* Business Details */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-black border-b border-gray-200 pb-2">Business Details</h3>

                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Website URL</label>
                      <input
                        type="url"
                        value={editableProfile?.website_url || ''}
                        onChange={(e) => setEditableProfile(prev => prev ? { ...prev, website_url: e.target.value } : null)}
                        disabled={!isEditing}
                        placeholder="https://yourwebsite.com"
                        className={`w-full px-4 py-3 border border-gray-200 rounded-lg text-black font-medium ${isEditing ? 'focus:ring-2 focus:ring-[#B9FF66] focus:border-transparent bg-white' : 'bg-gray-50'}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Years in Business</label>
                      <input
                        type="number"
                        value={editableProfile?.years_in_business || 0}
                        onChange={(e) => setEditableProfile(prev => prev ? { ...prev, years_in_business: parseInt(e.target.value) || 0 } : null)}
                        disabled={!isEditing}
                        placeholder="0"
                        className={`w-full px-4 py-3 border border-gray-200 rounded-lg text-black font-medium ${isEditing ? 'focus:ring-2 focus:ring-[#B9FF66] focus:border-transparent bg-white' : 'bg-gray-50'}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Business Registration Number</label>
                      <input
                        type="text"
                        value={editableProfile?.business_registration_number || ''}
                        onChange={(e) => setEditableProfile(prev => prev ? { ...prev, business_registration_number: e.target.value } : null)}
                        disabled={!isEditing}
                        placeholder="Enter registration number"
                        className={`w-full px-4 py-3 border border-gray-200 rounded-lg text-black font-medium ${isEditing ? 'focus:ring-2 focus:ring-[#B9FF66] focus:border-transparent bg-white' : 'bg-gray-50'}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Tax Identification Number</label>
                      <input
                        type="text"
                        value={editableProfile?.tax_identification_number || ''}
                        onChange={(e) => setEditableProfile(prev => prev ? { ...prev, tax_identification_number: e.target.value } : null)}
                        disabled={!isEditing}
                        placeholder="Enter tax ID"
                        className={`w-full px-4 py-3 border border-gray-200 rounded-lg text-black font-medium ${isEditing ? 'focus:ring-2 focus:ring-[#B9FF66] focus:border-transparent bg-white' : 'bg-gray-50'}`}
                      />
                    </div>

                    {/* Verification Status */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Verification Status</label>
                      <div className="flex items-center gap-3">
                        {getVerificationStatusDisplay()}
                        {vendorProfile.verification_notes && (
                          <span className="text-sm text-gray-600 font-medium">• {vendorProfile.verification_notes}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Availability Tab */}
          {activeTab === 'availability' && (
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-black mb-6">Set Your Availability</h2>
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CalendarIcon className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-3">Coming Soon</h3>
                <p className="text-gray-600 text-lg">
                  Availability management will be available in the next update.
                </p>
              </div>
            </div>
          )}

          {/* Enhanced Sessions Tab */}
          {activeTab === 'sessions' && (
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-black mb-6">Session Management</h2>
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-50 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ClockIcon className="w-12 h-12 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-3">No Sessions Yet</h3>
                <p className="text-gray-600 text-lg">
                  Once you set up your availability, clients can book sessions with you.
                </p>
              </div>
            </div>
          )}

          {/* Enhanced Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-3xl font-bold text-black mb-8">Analytics Overview</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <DollarSignIcon className="w-7 h-7 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-black">Total Revenue</h3>
                    <p className="text-3xl font-bold text-black">$0</p>
                    <p className="text-xs text-gray-600 mt-1 font-medium">This month</p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                    <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <BarChart3Icon className="w-7 h-7 text-emerald-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-black">Sessions</h3>
                    <p className="text-3xl font-bold text-black">0</p>
                    <p className="text-xs text-gray-600 mt-1 font-medium">Completed</p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                    <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <StarIcon className="w-7 h-7 text-purple-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-black">Rating</h3>
                    <p className="text-3xl font-bold text-black">0.0</p>
                    <p className="text-xs text-gray-600 mt-1 font-medium">0 reviews</p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                    <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <UserIcon className="w-7 h-7 text-orange-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-black">Clients</h3>
                    <p className="text-3xl font-bold text-black">0</p>
                    <p className="text-xs text-gray-600 mt-1 font-medium">Total</p>
                  </div>
                </div>

                <div className="text-center py-12 border-t border-gray-100">
                  <p className="text-gray-600 text-lg font-medium">
                    Analytics will be available once you start receiving bookings.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-black mb-6">Client Reviews</h2>
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircleIcon className="w-12 h-12 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-3">No Reviews Yet</h3>
                <p className="text-gray-600 text-lg">
                  Reviews from your clients will appear here once you complete your first sessions.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default VendorDashboard;