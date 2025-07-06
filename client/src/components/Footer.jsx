// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Story', href: '/story' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Blog', href: '/blog' },
    ],
    customer: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQs', href: '/faq' },
      { label: 'Shipping Info', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
      { label: 'Size Guide', href: '/size-guide' },
    ],
    policies: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Accessibility', href: '/accessibility' },
      { label: 'Security', href: '/security' },
    ],
    categories: [
      { label: 'Electronics', href: '/category/electronics' },
      { label: 'Fashion', href: '/category/fashion' },
      { label: 'Home & Garden', href: '/category/home' },
      { label: 'Sports', href: '/category/sports' },
      { label: 'Books', href: '/category/books' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
  ];

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      {/* Main Footer Content */}
      <div className="container-responsive py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">CommerceMax</h3>
                <p className="text-gray-400 text-sm">Your Premium Shopping Destination</p>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed max-w-md">
              Discover amazing products with unbeatable prices and quality. We're committed to providing 
              you with the best shopping experience and exceptional customer service.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>support@commercemax.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>123 Commerce Street, Business District</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="space-y-3">
              <h4 className="font-semibold text-lg text-white">Follow Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5 text-gray-300 group-hover:text-white" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">Customer Service</h4>
            <ul className="space-y-3">
              {footerLinks.customer.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="border-t border-gray-800">
        <div className="container-responsive py-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-2 text-white">
              Stay in the Loop!
            </h3>
            <p className="text-white opacity-90 mb-6 max-w-md mx-auto">
              Get the latest updates on new products, exclusive deals, and special offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:outline-none text-gray-900"
              />
              <button className="bg-purple-600 text-white px-8 py-3 text-lg rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-responsive py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>© {currentYear} CommerceMax. All rights reserved.</span>
              <span className="hidden md:inline">|</span>
              <span className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <span>by the CommerceMax Team</span>
              </span>
            </div>
            
            {/* Legal Links */}
            <div className="flex items-center space-x-6">
              {footerLinks.policies.slice(0, 3).map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
  