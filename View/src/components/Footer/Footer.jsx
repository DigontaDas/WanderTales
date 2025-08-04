import React from "react";
import { Link } from "react-router";

function Footer() {
  return (
    <footer className="bg-[#062b2b] text-white py-10 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand and Description */}
        <div>
          <h3 className="text-green-500 text-lg font-semibold mb-2">
            WanderTales
          </h3>
          <p className="text-sm text-gray-300">
            Your trusted companion for authentic travel experiences and
            community-driven recommendations.
          </p>
        </div>

        {/* WanderTales Links */}
        <div>
          <h3 className="text-green-500 text-lg font-semibold mb-4">
            WanderTales
          </h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:underline">
                Travel Stories
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:underline">
                Reviews & Ratings
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:underline">
                Travel Tips
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:underline">
                Interactive Maps
              </Link>
            </li>
          </ul>
        </div>

        {/* Community Links */}
        <div>
          <h3 className="text-green-500 text-lg font-semibold mb-4">
            Community
          </h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:underline">
                Join Community
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:underline">
                Travel Groups
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:underline">
                Events
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:underline">
                Ambassador Program
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="text-green-500 text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:underline">
                Help Center
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:underline">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:underline">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
