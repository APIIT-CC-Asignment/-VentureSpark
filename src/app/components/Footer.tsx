export default function Footer() {
    return (
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">VentureSpark</h3>
              <p className="text-gray-300">Your End-to-End Solution for Startup Success in Sri Lanka</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-300 hover:text-white transition">About Us</a></li>
                <li><a href="/services" className="text-gray-300 hover:text-white transition">Services</a></li>
                <li><a href="/mentors" className="text-gray-300 hover:text-white transition">Mentors</a></li>
                <li><a href="/contact" className="text-gray-300 hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p className="text-gray-300">Colombo, Sri Lanka</p>
              <p className="text-gray-300">Email: info@venturespark.lk</p>
              <p className="text-gray-300">Phone: +94 11 123 4567</p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-700 text-center">
            <p className="text-gray-300">&copy; {new Date().getFullYear()} VentureSpark. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }