import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/", showWhen: "always" },
    { name: "Destinations", path: "/destinations", showWhen: "always" },
    { name: "Stories", path: "/stories", showWhen: "always" },
    { name: "Hotel & Restaurants", path: "/hotel_restaurants", showWhen: "always" },
    
  ];

  const handleNavClick = (path) => navigate(path);
  const handleLogin = () => navigate("/login");
  const handleSignup = () => navigate("/signup");
  const handleUser = () => navigate("/profile");
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const shouldShowNavItem = (item) => {
    if (item.showWhen === "always") return true;
    if (item.showWhen === "loggedIn") return isAuthenticated;
    if (item.showWhen === "loggedOut") return !isAuthenticated;
    return true;
  };

  return (
    <header className="bg-[#062b2b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-8">
          <div className="flex-shrink-0 min-w-0">
            <button
              onClick={() => handleNavClick("/")}
              className="text-4xl md:text-5xl font-bold text-white hover:text-blue-800 transition-colors duration-200 whitespace-nowrap"
            >
              WanderTales
            </button>
          </div>

          <div className="flex-1 flex justify-center min-w-0">
            <nav className="hidden md:flex space-x-6 lg:space-x-10">
              {navItems.map((item) =>
                shouldShowNavItem(item) ? (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.path)}
                    className="text-white hover:text-blue-800 px-3 py-2 text-2xl lg:text-xl font-medium transition-colors duration-200 whitespace-nowrap"
                  >
                    {item.name}
                  </button>
                ) : null
              )}
            
            </nav>
          </div>

          {!isAuthenticated ? (
            <>
              <button
                onClick={handleLogin}
                className="bg-green-600 hover:bg-green-700 text-white px-3 lg:px-4 py-2 text-2xl lg:text-xl font-medium rounded-full transition-all duration-200 whitespace-nowrap"
              >
                Login
              </button>

              <button
                onClick={handleSignup}
                className="bg-green-600 hover:bg-blue-700 text-white px-3 lg:px-4 py-2 text-2xl lg:text-xl font-medium rounded-full transition-all duration-200 whitespace-nowrap"
              >
                Start Journey
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="text-white hover:text-red-400 px-3 lg:px-4 py-2 text-2xl lg:text-xl font-medium border border-gray-300 rounded-full hover:border-red-300 transition-all duration-200 whitespace-nowrap"
              >
                Logout
              </button>
              <button
                onClick={handleUser}
                className="text-white hover:text-red-400 px-3 lg:px-4 py-2 text-2xl lg:text-xl font-medium border border-gray-300 rounded-full hover:border-red-300 transition-all duration-200 whitespace-nowrap"
              >
                Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
