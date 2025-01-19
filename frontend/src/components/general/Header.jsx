import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, User, LogOut, ChevronDown } from "lucide-react";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This should come from your auth context
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const links = [
    { name: "Home", url: "/" },
    { name: "Finance", url: "finance" },
    { name: "Leisure", url: "leisure" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-tr from-[#66cfd1] via-[#32C944] to-[#00f5AB]">
                BILLIFY
              </span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.url}
                className={({ isActive }) =>
                  `text-base font-medium transition-colors hover:text-[#32C944] ${
                    isActive ? "text-[#32C944]" : "text-gray-700"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {!isLoggedIn ? (
                <div className="flex space-x-3">
                  <button className="px-4 py-2 text-gray-700 hover:text-[#32C944] transition-colors">
                    Login
                  </button>
                  <button className="px-4 py-2 bg-[#32C944] text-white rounded-lg hover:bg-[#2ba939] transition-colors">
                    Register
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={toggleProfileMenu}
                    className="flex items-center space-x-2 text-gray-700 hover:text-[#32C944] transition-colors"
                  >
                    <User size={20} />
                    <span>John Doe</span>
                    <ChevronDown size={16} />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                      <NavLink
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Profile Settings
                      </NavLink>
                      <button
                        onClick={() => {
                          /* Handle logout */
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            {isMenuOpen ? (
              <span className="text-32">$</span>
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-2 space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.url}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? "bg-[#32C944] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}

            {!isLoggedIn ? (
              <div className="space-y-2 pt-2 pb-3">
                <button className="w-full px-3 py-2 text-center text-gray-700 hover:bg-gray-100 rounded-lg">
                  Login
                </button>
                <button className="w-full px-3 py-2 text-center bg-[#32C944] text-white rounded-lg hover:bg-[#2ba939]">
                  Register
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-2 pb-3">
                <NavLink
                  to="/profile"
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={20} className="mr-2" />
                  Profile Settings
                </NavLink>
                <button className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <LogOut size={20} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
