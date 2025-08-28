import React from 'react'
import WeatherWidget from './WeatherWidget';
import heroImage from "../assets/bg2.jpg"
import Stories from './Stories';

// Main Home Page Component
function HomePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-200 via-blue-800 to-indigo-900">
      {/* Hero Section */}
       <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Adventure landscape"
          className="w-full h-full object-cover"
        />
      </div>
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-60 pb-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Share Your Journey
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
              Discover amazing places through authentic traveler stories and experiences
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-40">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Feature 1 */}
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📍</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Discover Places</h3>
                <p className="text-white/80">
                  Find hidden gems and popular destinations through real traveler experiences
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Check Stories</h3>
                <p className="text-white/80">
                  Join a community of adventurers sharing their stories and tips
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📸</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Share Your Story</h3>
                <p className="text-white/80">
                  Document your adventures and inspire others to explore the world
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Widget Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <WeatherWidget />
          </div>
      </main>
    </div>
  );
}

export default HomePage;
