// // File: app/components/ConsultantDashboard.tsx
// 'use client';

// import React, { useState, useEffect } from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import { useRouter } from 'next/navigation';
// import { Value } from 'react-calendar/src/shared/types.js';
// import { enUS } from 'date-fns/locale';


// interface VendorProfile {
//   id: string;
//   name: string;
//   email: string;
//   expertise: string;
//   bio: string;
//   hourly_rate: number;
// }

// interface Availability {
//   id: string;
//   vendor_id: string;
//   start_time: string;
//   end_time: string;
// }

// const ConsultantDashboard: React.FC = () => {
//   const [profile, setProfile] = useState<VendorProfile>({
//     id: '',
//     name: '',
//     email: '',
//     expertise: '',
//     bio: '',
//     hourly_rate: 0,
//   });
//   const [availability, setAvailability] = useState<Availability[]>([]);
//   const [selectedDate, setSelectedDate] = useState<Date>(new Date());
//   const [startTime, setStartTime] = useState('');
//   const [endTime, setEndTime] = useState('');
//   const router = useRouter();

//   // Replace with actual vendor ID from auth context
//   const vendorId = '1';

//   useEffect(() => {
//     fetchProfile();
//     fetchAvailability();
//   }, []);

//   const fetchProfile = async () => {
//     const response = await fetch(`/api/vendor/profile?vendorId=${vendorId}`);
//     const data = await response.json();
//     setProfile(data);
//   };

//   const fetchAvailability = async () => {
//     const response = await fetch(`/api/vendor/availability?vendorId=${vendorId}`);
//     const data = await response.json();
//     setAvailability(data);
//   };

//   const handleProfileSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const response = await fetch('/api/vendor/profile', {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(profile),
//     });
//     if (response.ok) {
//       alert('Profile updated successfully');
//     }
//   };

//   const handleAvailabilitySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const response = await fetch('/api/vendor/availability', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         vendorId,
//         startTime: `${selectedDate.toISOString().split('T')[0]} ${startTime}:00`,
//         endTime: `${selectedDate.toISOString().split('T')[0]} ${endTime}:00`,
//       }),
//     });
//     if (response.ok) {
//       fetchAvailability();
//       setStartTime('');
//       setEndTime('');
//     }
//   };
//   const handleDateChange = (value: Value, event: React.MouseEvent<HTMLButtonElement>) => {
//     if (value instanceof Date) {
//       setSelectedDate(value); // Assuming setSelectedDate is a Dispatch<SetStateAction<Date>>
//     } else {
//       console.warn('Unexpected value:', value);
//     }
//   };



//   return (
//     <div className="min-h-screen bg-gradient-to-r from-blue-900 to-teal-500">
//       <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">
//           <h1 className="text-3xl font-bold text-white mb-6">Consultant Dashboard</h1>

//           {/* Profile Section */}
//           <div className="bg-white bg-opacity-90 shadow rounded-lg p-6 mb-6">
//             <h2 className="text-xl font-semibold text-blue-900 mb-4">Profile Management</h2>
//             <form onSubmit={handleProfileSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-blue-900">Name</label>
//                 <input
//                   type="text"
//                   value={profile.name}
//                   onChange={(e) => setProfile({ ...profile, name: e.target.value })}
//                   className="text-black mt-1 block w-full rounded-md border-teal-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-blue-900">Expertise</label>
//                 <input
//                   type="text"
//                   value={profile.expertise}
//                   onChange={(e) => setProfile({ ...profile, expertise: e.target.value })}
//                   className="text-black mt-1 block w-full rounded-md border-teal-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-blue-900">Bio</label>
//                 <textarea
//                   value={profile.bio}
//                   onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
//                   className="text-black mt-1 block w-full rounded-md border-teal-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
//                   rows={4}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-blue-900">Hourly Rate ($)</label>
//                 <input
//                   type="number"
//                   value={profile.hourly_rate}
//                   onChange={(e) => setProfile({ ...profile, hourly_rate: parseFloat(e.target.value) })}
//                   className="text-black mt-1 block w-full rounded-md border-teal-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300"
//               >
//                 Save Profile
//               </button>
//             </form>
//           </div>

//           {/* Availability Section */}
//           <div className="bg-white bg-opacity-90 shadow rounded-lg p-6">
//             <h2 className="text-xl font-semibold text-blue-900 mb-4">Set Availability</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <Calendar
//                   onChange={handleDateChange}
//                   value={selectedDate}
//                   className="rounded-md border-teal-300 shadow-sm"
//                   locale="en-US" // Add this line to ensure consistent formatting
//                 />
//               </div>
//               <div>
//                 <form onSubmit={handleAvailabilitySubmit} className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-blue-900">Start Time</label>
//                     <input
//                       type="time"
//                       value={startTime}
//                       onChange={(e) => setStartTime(e.target.value)}
//                       className="mt-1 block w-full rounded-md border-teal-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-blue-900">End Time</label>
//                     <input
//                       type="time"
//                       value={endTime}
//                       onChange={(e) => setEndTime(e.target.value)}
//                       className="mt-1 block w-full rounded-md border-teal-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
//                       required
//                     />
//                   </div>
//                   <button
//                     type="submit"
//                     className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300"
//                   >
//                     Add Availability
//                   </button>
//                 </form>

//                 <div className="mt-6">
//                   <h3 className="text-lg font-medium text-blue-900">Current Availability</h3>
//                   <ul className="mt-2 divide-y divide-teal-200">
//                     {availability.map((slot) => (
//                       <li key={slot.id} className="py-2 text-blue-900">
//                         {new Date(slot.start_time).toLocaleString()} -{' '}
//                         {new Date(slot.end_time).toLocaleString()}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConsultantDashboard;
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon, XCircleIcon, PlusIcon, AlertCircleIcon } from 'lucide-react';
import { FileTextIcon } from 'lucide-react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { TextField } from '@mui/material';

interface VendorBasicInfo {
  id: string;
  service_name: string;
  years_of_excellence: number;
  email: string;
  contact_number: string;
  address: string;
  selected_services: string;
  type: string;
  active: number;
  expertise_in: string;
}

interface VendorProfileInfo {
  id: string;
  vendor_id: string;
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
}

interface Availability {
  id: string;
  vendor_id: string;
  start_time: string;
  end_time: string;
}

interface PortfolioDocument {
  title: string;
  url: string;
}

interface SocialMediaLink {
  platform: string;
  url: string;
}

interface Certification {
  name: string;
  issuer: string;
  year: number;
}

const ConsultantDashboard: React.FC = () => {
  // State for basic vendor info (pre-populated)
  const [vendorInfo, setVendorInfo] = useState<VendorBasicInfo>({
    id: '',
    service_name: '',
    years_of_excellence: 0,
    email: '',
    contact_number: '',
    address: '',
    selected_services: '',
    type: '',
    active: 1,
    expertise_in: '',
  });

  // State for vendor profile
  const [profileInfo, setProfileInfo] = useState<VendorProfileInfo>({
    id: '',
    vendor_id: '',
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
  });

  // Parsed portfolio documents
  const [portfolioDocuments, setPortfolioDocuments] = useState<PortfolioDocument[]>([]);
  const [newDocument, setNewDocument] = useState<PortfolioDocument>({ title: '', url: '' });

  // Parsed social media links
  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMediaLink[]>([]);
  const [newSocialLink, setNewSocialLink] = useState<SocialMediaLink>({ platform: '', url: '' });

  // Parsed certifications
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [newCertification, setNewCertification] = useState<Certification>({ name: '', issuer: '', year: new Date().getFullYear() });

  // Availability states
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [timeSlots, setTimeSlots] = useState<{ start: string; end: string }[]>([]);

  // UI states
  const [activeTab, setActiveTab] = useState('verification');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [dataLoaded, setDataLoaded] = useState(false);
  const [profileMissingFields, setProfileMissingFields] = useState<string[]>([]);

  const router = useRouter();
  const vendorId = '1'; // Replace with actual vendor ID from auth context

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchVendorData(), fetchProfileData(), fetchAvailability()]);
      setDataLoaded(true);
    };
    loadData();
  }, []);

  // Parse JSON strings when profileInfo changes
  useEffect(() => {
    try {
      if (profileInfo.portfolio_documents) {
        setPortfolioDocuments(JSON.parse(profileInfo.portfolio_documents));
      }
      if (profileInfo.social_media_links) {
        const links = JSON.parse(profileInfo.social_media_links);
        setSocialMediaLinks(Object.keys(links).map((platform) => ({ platform, url: links[platform] })));
      }
      if (profileInfo.certifications) {
        setCertifications(JSON.parse(profileInfo.certifications));
      }
    } catch (e) {
      console.error('Error parsing JSON data', e);
    }
  }, [profileInfo]);

  // Check profile completion
  useEffect(() => {
    if (dataLoaded) {
      const missingFields = identifyMissingFields();
      setProfileMissingFields(missingFields);
      if (missingFields.length > 0 && activeTab === 'profile') {
        setActiveTab('verification');
      }
    }
  }, [dataLoaded, profileInfo]);

  const identifyMissingFields = (): string[] => {
    const missing: string[] = [];
    if (!profileInfo.website_url) missing.push('Website URL');
    if (portfolioDocuments.length === 0) missing.push('Portfolio Documents');
    if (profileInfo.years_in_business <= 0) missing.push('Years in Business');
    if (!profileInfo.business_registration_number) missing.push('Business Registration');
    if (!profileInfo.tax_identification_number) missing.push('Tax ID');
    if (socialMediaLinks.length === 0) missing.push('Social Media Links');
    if (certifications.length === 0) missing.push('Certifications');
    return missing;
  };

  const fetchVendorData = async () => {
    try {
      const response = await fetch(`/api/vendor?vendorId=${vendorId}`);
      if (response.ok) {
        const data = await response.json();
        setVendorInfo(data);
      }
    } catch (error) {
      console.error('Error fetching vendor data:', error);
      setFeedback({ type: 'error', message: 'Failed to load vendor information.' });
    }
  };

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`/api/vendor-profile?vendorId=${vendorId}`);
      if (response.ok) {
        const data = await response.json();
        setProfileInfo(data);
      } else if (response.status === 404) {
        setProfileInfo({ ...profileInfo, vendor_id: vendorId });
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setFeedback({ type: 'error', message: 'Failed to load profile information.' });
    }
  };

  const fetchAvailability = async () => {
    try {
      const response = await fetch(`/api/vendor-availability?vendorId=${vendorId}`);
      if (response.ok) {
        const data = await response.json();
        setAvailability(data);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const handleVendorInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setVendorInfo({ ...vendorInfo, [e.target.name]: e.target.value });
  };

  const handleProfileInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProfileInfo({ ...profileInfo, [e.target.name]: e.target.value });
  };

  const addPortfolioDocument = () => {
    if (newDocument.title && newDocument.url) {
      const updatedDocs = [...portfolioDocuments, newDocument];
      setPortfolioDocuments(updatedDocs);
      setProfileInfo({ ...profileInfo, portfolio_documents: JSON.stringify(updatedDocs) });
      setNewDocument({ title: '', url: '' });
    }
  };

  const removePortfolioDocument = (index: number) => {
    const updatedDocs = portfolioDocuments.filter((_, i) => i !== index);
    setPortfolioDocuments(updatedDocs);
    setProfileInfo({ ...profileInfo, portfolio_documents: JSON.stringify(updatedDocs) });
  };

  const addSocialMediaLink = () => {
    if (newSocialLink.platform && newSocialLink.url) {
      const updatedLinks = [...socialMediaLinks, newSocialLink];
      setSocialMediaLinks(updatedLinks);
      const linksObject = updatedLinks.reduce((acc, link) => ({ ...acc, [link.platform]: link.url }), {});
      setProfileInfo({ ...profileInfo, social_media_links: JSON.stringify(linksObject) });
      setNewSocialLink({ platform: '', url: '' });
    }
  };

  const removeSocialMediaLink = (index: number) => {
    const updatedLinks = socialMediaLinks.filter((_, i) => i !== index);
    setSocialMediaLinks(updatedLinks);
    const linksObject = updatedLinks.reduce((acc, link) => ({ ...acc, [link.platform]: link.url }), {});
    setProfileInfo({ ...profileInfo, social_media_links: JSON.stringify(linksObject) });
  };

  const addCertification = () => {
    if (newCertification.name && newCertification.issuer) {
      const updatedCerts = [...certifications, newCertification];
      setCertifications(updatedCerts);
      setProfileInfo({ ...profileInfo, certifications: JSON.stringify(updatedCerts) });
      setNewCertification({ name: '', issuer: '', year: new Date().getFullYear() });
    }
  };

  const removeCertification = (index: number) => {
    const updatedCerts = certifications.filter((_, i) => i !== index);
    setCertifications(updatedCerts);
    setProfileInfo({ ...profileInfo, certifications: JSON.stringify(updatedCerts) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback({ type: '', message: '' });

    try {
      const vendorResponse = await fetch('/api/vendor', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendorInfo),
      });

      if (!vendorResponse.ok) throw new Error('Failed to update vendor information'); // Line 499

      const profileResponse = await fetch('api/vendor-profile', {
        method: profileInfo.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileInfo),
      });

      if (!profileResponse.ok) throw new Error('Failed to update profile information');

      setFeedback({ type: 'success', message: 'Profile updated successfully!' });
      fetchVendorData();
      fetchProfileData();
    } catch (error) {
      console.error('Error updating profile:', error);
      setFeedback({ type: 'error', message: 'An error occurred while updating your profile.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTimeSlot = () => {
    if (startTime && endTime) {
      setTimeSlots([...timeSlots, { start: startTime, end: endTime }]);
      setStartTime('');
      setEndTime('');
    }
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const handleAvailabilitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (startTime && endTime) addTimeSlot();
    if (timeSlots.length === 0) {
      setFeedback({ type: 'error', message: 'Please add at least one time slot.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: '', message: '' });

    try {
      const promises = timeSlots.map((slot) =>
        fetch('/api/vendor-availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vendorId,
            startTime: `${selectedDate?.format('YYYY-MM-DD')} ${slot.start}:00`,
            endTime: `${selectedDate?.format('YYYY-MM-DD')} ${slot.end}:00`,
          }),
        })
      );

      await Promise.all(promises);
      setTimeSlots([]);
      fetchAvailability();
      setFeedback({ type: 'success', message: `${timeSlots.length} availability slot(s) added successfully!` });
    } catch (error) {
      console.error('Error adding availability:', error);
      setFeedback({ type: 'error', message: 'Failed to add availability.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeAvailability = async (availabilityId: string) => {
    try {
      const response = await fetch(`/api-availability?id=${availabilityId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchAvailability();
        setFeedback({ type: 'success', message: 'Availability removed successfully!' });
      }
    } catch (error) {
      console.error('Error removing availability:', error);
      setFeedback({ type: 'error', message: 'Failed to remove availability.' });
    }
  };

  const calculateCompletionPercentage = () => {
    const fields = [
      profileInfo.website_url,
      portfolioDocuments.length > 0,
      profileInfo.years_in_business > 0,
      profileInfo.business_registration_number,
      profileInfo.tax_identification_number,
      socialMediaLinks.length > 0,
      certifications.length > 0,
    ];
    const filledFields = fields.filter((field) => field).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const getVerificationStatusDisplay = () => {
    switch (profileInfo.verification_status) {
      case 'verified':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            Verified
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="w-4 h-4 mr-1" />
            Verification Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pending Verification
          </span>
        );
    }
  };

  if (!dataLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-indigo-900 to-blue-600 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-center mb-4">Loading Consultant Dashboard</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="min-h-screen bg-gradient-to-r from-indigo-900 to-blue-600">
        <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-white drop-shadow-md">Consultant Dashboard</h1>
              <div className="flex space-x-3 items-center">
                {profileInfo.verification_status && getVerificationStatusDisplay()}
                <div className="relative w-40 h-10 bg-gray-700 bg-opacity-40 rounded-full overflow-hidden border border-blue-300">
                  <div className="h-full bg-blue-400 transition-all duration-500" style={{ width: `${calculateCompletionPercentage()}%` }}></div>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    {calculateCompletionPercentage()}% Complete
                  </span>
                </div>
              </div>
            </div>

            {profileMissingFields.length > 0 && (
              <div className="mb-6 p-4 rounded-lg shadow-md bg-amber-100 text-black border-l-4 border-amber-500">
                <div className="flex items-start">
                  <AlertCircleIcon className="w-6 h-6 text-amber-600 mr-2" />
                  <div>
                    <h3 className="font-bold">Complete your profile to get verified</h3>
                    <p className="mt-1">Please provide the following details:</p>
                    <ul className="mt-2 list-disc list-inside">
                      {profileMissingFields.map((field, index) => (
                        <li key={index}>{field}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {feedback.message && (
              <div
                className={`mb-6 p-4 rounded-lg shadow-md ${feedback.type === 'error' ? 'bg-red-100 text-black border-l-4 border-red-500' : 'bg-green-100 text-black border-l-4 border-green-500'
                  }`}
              >
                {feedback.message}
              </div>
            )}

            <div className="bg-white bg-opacity-20 rounded-t-lg overflow-hidden shadow-md">
              <nav className="flex" aria-label="Tabs">
                <button
                  className={`px-6 py-4 text-base font-medium transition-colors duration-200 ${activeTab === 'profile' ? 'text-black bg-white' : 'text-blue-700 bg-transparent'
                    }`}
                  onClick={() => setActiveTab('profile')}
                >
                  Basic Information
                </button>
                <button
                  className={`px-6 py-4 text-base font-medium transition-colors duration-200 ${activeTab === 'verification' ? 'text-black bg-white' : 'text-blue-700 bg-transparent'
                    }`}
                  onClick={() => setActiveTab('verification')}
                >
                  Verification Details
                </button>
                <button
                  className={`px-6 py-4 text-base font-medium transition-colors duration-200 ${activeTab === 'availability' ? 'text-black bg-white' : 'text-blue-700 bg-transparent'
                    }`}
                  onClick={() => setActiveTab('availability')}
                >
                  Availability
                </button>
              </nav>
            </div>

            <div className="bg-white shadow-lg rounded-b-lg p-8">
              <form onSubmit={handleSubmit}>
                {activeTab === 'profile' && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-semibold text-black border-b border-gray-200 pb-3">Basic Information</h2>
                    <p className="text-gray-600">Your basic information is pre-filled. You can update any field as needed.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-base font-medium text-black mb-2">Service Name</label>
                        <input
                          type="text"
                          name="service_name"
                          value={vendorInfo.service_name}
                          onChange={handleVendorInfoChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 py-3 px-4 text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-base font-medium text-black mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={vendorInfo.email}
                          onChange={handleVendorInfoChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 py-3 px-4 text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-base font-medium text-black mb-2">Contact Number</label>
                        <input
                          type="text"
                          name="contact_number"
                          value={vendorInfo.contact_number}
                          onChange={handleVendorInfoChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 py-3 px-4 text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-base font-medium text-black mb-2">Primary Expertise</label>
                        <input
                          type="text"
                          name="expertise_in"
                          value={vendorInfo.expertise_in}
                          onChange={handleVendorInfoChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 py-3 px-4 text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-base font-medium text-black mb-2">Years of Excellence</label>
                        <input
                          type="number"
                          name="years_of_excellence"
                          value={vendorInfo.years_of_excellence}
                          onChange={handleVendorInfoChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 py-3 px-4 text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-base font-medium text-black mb-2">Service Type</label>
                        <select
                          name="type"
                          value={vendorInfo.type}
                          onChange={handleVendorInfoChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 py-3 px-4 text-black"
                        >
                          <option value="">Select a type</option>
                          <option value="Freelancer">Freelancer</option>
                          <option value="Agency">Agency</option>
                          <option value="Consultant">Consultant</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-base font-medium text-black mb-2">Address</label>
                      <textarea
                        name="address"
                        value={vendorInfo.address}
                        onChange={handleVendorInfoChange}
                        rows={2}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 py-3 px-4 text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-medium text-black mb-2">Selected Services</label>
                      <textarea
                        name="selected_services"
                        value={vendorInfo.selected_services}
                        onChange={handleVendorInfoChange}
                        rows={2}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 py-3 px-4 text-black"
                        placeholder="Enter services separated by commas"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex justify-center py-3 px-6 border border-transparent shadow-md text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
                      >
                        {isSubmitting ? 'Saving...' : 'Update Basic Information'}
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'verification' && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-semibold text-black border-b border-gray-200 pb-3">Verification Details</h2>
                    <p className="text-gray-600">Complete these details to get verified. All fields are editable.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-base font-medium text-black mb-2">Website URL</label>
                        <input
                          type="url"
                          name="website_url"
                          value={profileInfo.website_url}
                          onChange={handleProfileInfoChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 py-3 px-4 text-black"
                          placeholder="https://example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-base font-medium text-black mb-2">Years in Business</label>
                        <input
                          type="number"
                          name="years_in_business"
                          value={profileInfo.years_in_business}
                          onChange={handleProfileInfoChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 py-3 px-4 text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-base font-medium text-black mb-2">Business Registration Number</label>
                        <input
                          type="text"
                          name="business_registration_number"
                          value={profileInfo.business_registration_number}
                          onChange={handleProfileInfoChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 py-3 px-4 text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-base font-medium text-black mb-2">Tax Identification Number</label>
                        <input
                          type="text"
                          name="tax_identification_number"
                          value={profileInfo.tax_identification_number}
                          onChange={handleProfileInfoChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 py-3 px-4 text-black"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-base font-medium text-black mb-2">Portfolio Documents</label>
                      <div className="mt-2 space-y-4">
                        {portfolioDocuments.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <div className="flex items-center">
                              <FileTextIcon className="w-5 h-5 text-blue-500 mr-2" />
                              <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {doc.title}
                              </a>
                            </div>
                            <button type="button" onClick={() => removePortfolioDocument(index)} className="text-red-500 hover:text-red-700">
                              <XCircleIcon className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Document Title"
                          value={newDocument.title}
                          onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 py-3 px-4 text-black"
                        />
                        <input
                          type="url"
                          placeholder="Document URL"
                          value={newDocument.url}
                          onChange={(e) => setNewDocument({ ...newDocument, url: e.target.value })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 py-3 px-4 text-black"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addPortfolioDocument}
                        disabled={!newDocument.title || !newDocument.url}
                        className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Document
                      </button>
                    </div>
                    <div>
                      <label className="block text-base font-medium text-black mb-2">Social Media Links</label>
                      <div className="mt-2 space-y-4">
                        {socialMediaLinks.map((link, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <div>
                              <span className="font-medium">{link.platform}: </span>
                              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {link.url}
                              </a>
                            </div>
                            <button type="button" onClick={() => removeSocialMediaLink(index)} className="text-red-500 hover:text-red-700">
                              <XCircleIcon className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Platform (e.g., LinkedIn)"
                          value={newSocialLink.platform}
                          onChange={(e) => setNewSocialLink({ ...newSocialLink, platform: e.target.value })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 py-3 px-4 text-black"
                        />
                        <input
                          type="url"
                          placeholder="Profile URL"
                          value={newSocialLink.url}
                          onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 py-3 px-4 text-black"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addSocialMediaLink}
                        disabled={!newSocialLink.platform || !newSocialLink.url}
                        className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Social Media Link
                      </button>
                    </div>
                    <div>
                      <label className="block text-base font-medium text-black mb-2">Certifications</label>
                      <div className="mt-2 space-y-4">
                        {certifications.map((cert, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <div>
                              <span className="font-medium">{cert.name}</span> - {cert.issuer} ({cert.year})
                            </div>
                            <button type="button" onClick={() => removeCertification(index)} className="text-red-500 hover:text-red-700">
                              <XCircleIcon className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder="Certification Name"
                          value={newCertification.name}
                          onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 py-3 px-4 text-black"
                        />
                        <input
                          type="text"
                          placeholder="Issuer"
                          value={newCertification.issuer}
                          onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 py-3 px-4 text-black"
                        />
                        <input
                          type="number"
                          placeholder="Year"
                          value={newCertification.year}
                          onChange={(e) => setNewCertification({ ...newCertification, year: parseInt(e.target.value) })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 py-3 px-4 text-black"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addCertification}
                        disabled={!newCertification.name || !newCertification.issuer}
                        className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add Certification
                      </button>
                    </div>
                    {profileInfo.verification_status === 'rejected' && profileInfo.verification_notes && (
                      <div>
                        <label className="block text-base font-medium text-black mb-2">Verification Notes</label>
                        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                          <p className="text-red-700">{profileInfo.verification_notes}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex justify-center py-3 px-6 border border-transparent shadow-md text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
                      >
                        {isSubmitting ? 'Saving...' : 'Save Verification Details'}
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'availability' && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-semibold text-black border-b border-gray-200 pb-3">Manage Availability</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-base font-medium text-black mb-2">Select Date</label>
                        <DatePicker
                          value={selectedDate}
                          onChange={(newValue: any) => setSelectedDate(newValue)}
                          minDate={dayjs()}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                            },
                          }}
                          sx={{ width: '100%' }}
                        />

                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-black mb-4">Add Time Slots for {selectedDate?.format('MMMM D, YYYY')}</h3>
                        <form onSubmit={handleAvailabilitySubmit}>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-black mb-1">Start Time</label>
                                <input
                                  type="time"
                                  value={startTime}
                                  onChange={(e) => setStartTime(e.target.value)}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 py-2 px-3 text-black"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-black mb-1">End Time</label>
                                <input
                                  type="time"
                                  value={endTime}
                                  onChange={(e) => setEndTime(e.target.value)}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 py-2 px-3 text-black"
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={addTimeSlot}
                              disabled={!startTime || !endTime}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                              <PlusIcon className="w-4 h-4 mr-2" />
                              Add Time Slot
                            </button>
                            {timeSlots.length > 0 && (
                              <div className="mt-4">
                                <h4 className="text-sm font-medium text-black mb-2">Added Time Slots:</h4>
                                <ul className="space-y-2">
                                  {timeSlots.map((slot, index) => (
                                    <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md text-black">
                                      <span>
                                        {slot.start} - {slot.end}
                                      </span>
                                      <button type="button" onClick={() => removeTimeSlot(index)} className="text-red-500 hover:text-red-700">
                                        <XCircleIcon className="w-5 h-5" />
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <div className="mt-6">
                              <button
                                type="submit"
                                disabled={isSubmitting || timeSlots.length === 0}
                                className="inline-flex justify-center py-3 px-6 border border-transparent shadow-md text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
                              >
                                {isSubmitting ? 'Saving...' : 'Save Availability'}
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-black mb-4">Existing Availability</h3>
                      {availability.length > 0 ? (
                        <div className="space-y-4">
                          {availability.map((slot) => (
                            <div key={slot.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                              <span>
                                {new Date(slot.start_time).toLocaleString()} - {new Date(slot.end_time).toLocaleString()}
                              </span>
                              <button type="button" onClick={() => removeAvailability(slot.id)} className="text-red-500 hover:text-red-700">
                                <XCircleIcon className="w-5 h-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No availability set yet.</p>
                      )}
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default ConsultantDashboard;