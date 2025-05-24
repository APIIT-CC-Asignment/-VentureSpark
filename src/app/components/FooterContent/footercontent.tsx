import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const FooterContent = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">
                VentureSpark
              </h2>
            </div>
            <p className="text-gray-400">
              Empowering startups with expert guidance and strategic consulting.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaFacebookF size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaLinkedinIn size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-white flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {['Home',  'About', 'Services', 'Contact'].map((item) => (
                <li key={item}>
                  <a 
                    href="/"
                    className="text-gray-400 hover:text-green-400 transition-colors duration-300 flex items-center"
                  >
                    <span className="w-1 h-1 bg-gray-500 rounded-full mr-2"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-white flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaEnvelope className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-400">support@venturespark.com</span>
              </li>
              <li className="flex items-start">
                <FaPhoneAlt className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-400">+1 (234) 567-8900</span>
              </li>
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-400">123 Innovation Blvd, Tech City</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-white flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Newsletter
            </h3>
            <p className="text-gray-400 mb-4">
              Subscribe to get updates on new consultants and special offers.
            </p>
            <form className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} VentureSpark. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors duration-300">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors duration-300">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterContent;