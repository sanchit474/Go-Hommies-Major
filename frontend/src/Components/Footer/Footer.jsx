import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-6 md:px-12 py-16">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 pb-12 border-b border-slate-800">
          
          {/* Left: Logo + Description */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">GH</span>
              </div>
              <span className="text-2xl font-bold text-white">GoHomies</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-md">
              Connect with fellow travelers, plan group trips, and create unforgettable memories. GoHomies is your community for adventure-seekers and travel enthusiasts.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-white hover:bg-primary transition-all duration-300" title="Facebook">
                <FaFacebookF size={16} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-white hover:bg-primary transition-all duration-300" title="Twitter">
                <FaTwitter size={16} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-white hover:bg-primary transition-all duration-300" title="Instagram">
                <FaInstagram size={16} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-white hover:bg-primary transition-all duration-300" title="LinkedIn">
                <FaLinkedinIn size={16} />
              </a>
            </div>
          </div>

          {/* Right: Newsletter */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              Stay Updated
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Subscribe to get the latest travel tips, featured destinations, and exclusive offers.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-primary text-sm text-white"
                required
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-blue-600 transition-all font-bold whitespace-nowrap shadow-lg shadow-primary/20"
              >
                Subscribe
              </button>
            </form>
            {subscribed && (
              <p className="text-secondary text-sm mt-3 font-medium">✓ Thanks for subscribing!</p>
            )}
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          
          {/* Explore */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-widest">Explore</h4>
            <ul className="space-y-3">
              <li><a href="/" className="text-slate-400 text-sm hover:text-primary transition">Home</a></li>
              <li><a href="/posts" className="text-slate-400 text-sm hover:text-primary transition">Travel Posts</a></li>
              <li><a href="/vlogs" className="text-slate-400 text-sm hover:text-primary transition">Travel Vlogs</a></li>
              <li><a href="/booking" className="text-slate-400 text-sm hover:text-primary transition">My Bookings</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-widest">Company</h4>
            <ul className="space-y-3">
              <li><a href="/about_us" className="text-slate-400 text-sm hover:text-primary transition">About Us</a></li>
              <li><a href="/contact_us" className="text-slate-400 text-sm hover:text-primary transition">Contact Us</a></li>
              <li><a href="#" className="text-slate-400 text-sm hover:text-primary transition">Careers</a></li>
              <li><a href="#" className="text-slate-400 text-sm hover:text-primary transition">Blog</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-widest">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 text-sm hover:text-primary transition">Safety Tips</a></li>
              <li><a href="#" className="text-slate-400 text-sm hover:text-primary transition">Travel Guides</a></li>
              <li><a href="#" className="text-slate-400 text-sm hover:text-primary transition">FAQs</a></li>
              <li><a href="#" className="text-slate-400 text-sm hover:text-primary transition">Support</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-widest">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 text-sm hover:text-primary transition">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 text-sm hover:text-primary transition">Terms of Service</a></li>
              <li><a href="#" className="text-slate-400 text-sm hover:text-primary transition">Cookie Policy</a></li>
              <li><a href="#" className="text-slate-400 text-sm hover:text-primary transition">Disclaimer</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 border-t border-slate-800 pt-8">
          <p>© 2024 GoHomies. All rights reserved.</p>
          <p className="mt-4 sm:mt-0 font-medium">Made with <span className="text-red-500">❤️</span> for Travelers</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
