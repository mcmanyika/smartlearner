import React from 'react';
import { FaSearch, FaPlus, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';

const Home = () => {
  return (
    <div
      className="bg-cover bg-center min-h-screen"
      style={{
        backgroundImage: "url('/images/harare.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Optional Overlay with Reduced Opacity */}
      <div className="bg-gradient-to-b from-gray-900 to-transparent opacity-80 min-h-screen">
        {/* Header */}
        <header className="text-center pt-20 pb-10">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">School Finder ZIM</h1>
          <p className="text-lg text-white mt-2 drop-shadow-lg">Find The Right School For Your Child</p>
        </header>

        {/* Search and Filter Section */}
        <section className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg mb-8">
          {/* Tabs */}
          <div className="flex justify-around mb-6 text-gray-700">
            <button className="flex items-center gap-2 font-semibold text-blue-700">
              <FaPlus /> School
            </button>
            <button className="flex items-center gap-2">
              <FaBriefcase /> Jobs
            </button>
            <button className="flex items-center gap-2">
              <FaCalendarAlt /> Events
            </button>
          </div>

          {/* Search Inputs */}
          <div className="grid grid-cols-1 bg-white md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Search By School Name"
              className="border p-3 rounded-lg focus:outline-blue-700"
            />
            <select className="border p-3 rounded-lg focus:outline-blue-700">
              <option>School Stage</option>
              <option>Primary</option>
              <option>Secondary</option>
              <option>High School</option>
            </select>
            <select className="border p-3 rounded-lg focus:outline-blue-700">
              <option>Curriculum</option>
              <option>American</option>
              <option>British</option>
              <option>International</option>
            </select>
            <select className="border p-3 rounded-lg focus:outline-blue-700">
              <option>Annual Fee Range</option>
              <option>Less than $5,000</option>
              <option>$5,000 - $10,000</option>
              <option>More than $10,000</option>
            </select>
            <select className="border p-3 rounded-lg focus:outline-blue-700">
              <option>Location</option>
              <option>Harare</option>
              <option>Bulawayo</option>
              <option>Mutare</option>
            </select>
            <button className="bg-blue-700 text-white p-3 rounded-lg flex items-center justify-center">
              <FaSearch className="mr-2" /> Search
            </button>
          </div>
        </section>

        {/* Advertisement Banner */}
        <section className="max-w-5xl mx-auto mb-8">
          <div className="bg-purple-700 text-white p-4 rounded-lg text-center bg-opacity-90 shadow-lg">
            <h2 className="text-lg font-semibold">Admissions Open! Nursery - Year 12</h2>
            <button className="mt-2 bg-orange-600 px-4 py-2 rounded-full">Register Now</button>
          </div>
        </section>

        {/* Location Cards */}
        <section className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-7 gap-6 text-center">
          {["Harare", "Bulawayo", "Mutare", "Gweru", "Masvingo", "Chinhoyi", "Marondera"].map((location) => (
            <div key={location} className="bg-blue-100 p-4 rounded-lg shadow-lg">
              <FaSearch className="text-blue-700 text-2xl mb-2 mx-auto" />
              <h3 className="text-lg font-semibold">{location}</h3>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Home;
