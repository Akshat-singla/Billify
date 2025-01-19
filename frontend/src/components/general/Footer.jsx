import React from "react";
import { MapPin, Mail, Phone } from "lucide-react";
import src from "../../public/generated-logo.png";
function Footer() {
  const links = [
    { name: "Home", url: "/" },
    { name: "Finance", url: "finance" },
    { name: "Leisure", url: "leisure" },
  ];
  const socialLinks = [];
  return (
    <footer className="bg-[#21522d] text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img src={src} alt="Company Logo" className="h-20 w-auto" />
                <span className="text-5xl font-bold text-white">BILLIFY</span>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                Providing innovative solutions for your business needs since
                2020.
              </p>
              {/* Social Links */}
              <div className="flex space-x-4 mt-6">
                {socialLinks &&
                  socialLinks.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label={label}
                    >
                      <Icon size={20} />
                    </a>
                  ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.to}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Contact Us
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:info@company.com"
                    className="flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    <Mail size={16} className="mr-2" />
                    info@company.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+11234567890"
                    className="flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    <Phone size={16} className="mr-2" />
                    (123) 456-7890
                  </a>
                </li>
                <li className="flex items-start text-gray-400">
                  <MapPin size={16} className="mr-2 mt-1 flex-shrink-0" />
                  <span>
                    123 Business Street
                    <br />
                    New York, NY 10001
                  </span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Newsletter
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Subscribe to our newsletter for updates and insights.
              </p>
              <form className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-[#32c944] text-white rounded hover:bg-[#00f5ab] transition-colors focus:outline-none focus:ring-2 focus:ring-greem-500"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Company Name. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="/privacy"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
