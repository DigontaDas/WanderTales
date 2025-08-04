import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SearchBar from "../Searchbar/Searchbar"

// SearchBar Component - Integrated into Header

function Header() {
  // State to track if user is logged in (you can connect this to your backend later)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate()
  // Navigation items - you can modify these based on your needs
  const navItems = [
    {
      name: 'Home',
      path: '/',
      showWhen: 'always' // always, loggedIn, loggedOut
    },
    {
      name: 'Destinations',
      path: '/destinations',
      showWhen: 'always'
    },
    {
      name: 'Stories',
      path: '/stories',
      showWhen: 'always'
    },

  ];

  // Function to handle navigation clicks (you can connect to React Router later)
  const handleNavClick = (path) => {
      navigate(path);
    // Later you can use: navigate(path) with React Router
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };
  const handleUser = () => {
    navigate('/profile');
  };

  // Function to handle logout (you can connect to your auth system later)
  const handleLogout = () => {
    setIsLoggedIn(false);
    // Later you can call your logout API and clear user data
  };

  // Function to check if a nav item should be shown
  const shouldShowNavItem = (item) => {
    if (item.showWhen === 'always') return true;
    if (item.showWhen === 'loggedIn') return isLoggedIn;
    if (item.showWhen === 'loggedOut') return !isLoggedIn;
    return true;
  };

  return (
    <header className="bg-[#062b2b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left Section - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <button 
                onClick={() => handleNavClick('/')}
                className="text-2xl font-bold text-white hover:text-blue-300 transition-colors duration-200"
              >
                WanderTales
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex space-x-6">
              {navItems.map((item) => 
                shouldShowNavItem(item) ? (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.path)}
                    className="text-white hover:text-blue-300 px-3 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    {item.name}
                  </button>
                ) : null
              )}
            </nav>
          </div>

          {/* Center Section - Search Bar */}
          <div className="flex-1 flex justify-center mx-8">
            <SearchBar />
          </div>

          {/* Right Section - Auth Buttons */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {!isLoggedIn ? (
              <>
                {/* Login Button */}
                <button
                  onClick={handleLogin}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-medium rounded-full transition-all duration-200"
                >
                  Login
                </button>
                
                {/* Signup Button */}
                <button
                  onClick={handleSignup}
                  className="bg-green-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium rounded-full transition-all duration-200"
                >
                  Start Journey
                </button>
              </>
            ) : (
              <>
                {/* User Profile (when logged in) */}
                <div className="flex items-center space-x-3">
                  <span className="text-blue-300 text-sm">Welcome back!</span>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-red-400 px-4 py-2 text-sm font-medium border border-gray-300 rounded-full hover:border-red-300 transition-all duration-200"
                  >
                    Logout
                  </button>
                  <button
                    onClick={handleUser}
                    className="text-white hover:text-red-400 px-4 py-2 text-sm font-medium border border-gray-300 rounded-full hover:border-red-300 transition-all duration-200"
                  >
                    Profile
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      

      {/* Demo Controls (Remove this when you connect to real backend) */}
      <div className="bg-yellow-50 border-t border-yellow-200 px-4 py-2">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-yellow-800">
            <strong>Demo Mode:</strong> 
            <button 
              onClick={() => setIsLoggedIn(!isLoggedIn)}
              className="ml-2 text-yellow-900 underline hover:no-underline"
            >
              {isLoggedIn ? 'Switch to Logged Out' : 'Switch to Logged In'}
            </button>
          </p>
        </div>
      </div>
    </header>
  );
}

export default Header;