"use client";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Home = () => {
  const [filterName, setFilterName] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterCurriculum, setFilterCurriculum] = useState("");
  const [filterFeeRange, setFilterFeeRange] = useState("");
  const [filterOwnership, setFilterOwnership] = useState("");

  const router = useRouter();

  const handleSearch = () => {
    const queryParams = new URLSearchParams({
      name: filterName,
      location: filterLocation,
      curriculum: filterCurriculum,
      feeRange: filterFeeRange,
      ownership: filterOwnership,
    }).toString();

    router.push(`/libs/schools?${queryParams}`);
  };

  const handleLocationClick = (location) => {
    const queryParams = new URLSearchParams({
      location,
    }).toString();

    router.push(`/libs/schools?${queryParams}`);
  };

  return (
    <div
      className="bg-cover bg-center min-h-screen"
      style={{
        backgroundImage: "url('/images/harare.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-gradient-to-b from-gray-900 to-transparent opacity-80 min-h-screen">
        {/* Header */}
        <header className="text-center pt-20 pb-10">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">School Finder ZIM</h1>
          <p className="text-lg text-white mt-2 drop-shadow-lg">Find The Right School For Your Child</p>
        </header>

        {/* Search and Filter Section */}
        <section className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Search By School Name"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="border p-3 rounded-lg focus:outline-blue-700"
            />
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="border p-3 rounded-lg focus:outline-blue-700"
            >
              <option value="">Location</option>
              <option>Harare</option>
              <option>Bulawayo</option>
              <option>Mutare</option>
            </select>
            <select
              value={filterCurriculum}
              onChange={(e) => setFilterCurriculum(e.target.value)}
              className="border p-3 rounded-lg focus:outline-blue-700"
            >
              <option value="">Curriculum</option>
              <option>American</option>
              <option>British</option>
              <option>International</option>
              <option>ZIMSEC</option>
            </select>
            <select
              value={filterFeeRange}
              onChange={(e) => setFilterFeeRange(e.target.value)}
              className="border p-3 rounded-lg focus:outline-blue-700"
            >
              <option value="">Annual Fee Range</option>
              <option>Less than $100</option>
              <option>$101 - $500</option>
              <option>$501 - $1000</option>
              <option>$1001 - $3000</option>
              <option>Plus $3001</option>
            </select>
            <select
              value={filterOwnership}
              onChange={(e) => setFilterOwnership(e.target.value)}
              className="border p-3 rounded-lg focus:outline-blue-700"
            >
              <option value="">Ownership</option>
              <option>Government</option>
              <option>Council</option>
              <option>Private</option>
            </select>
            <button
              onClick={handleSearch}
              className="bg-blue-700 text-white p-3 rounded-lg flex items-center justify-center"
            >
              <FaSearch className="mr-2" /> Search
            </button>
          </div>
        </section>
        {/* Advertisement Banner */}
        <section className="max-w-5xl mx-auto mb-8">
          <div className="bg-purple-700 text-white p-4 rounded-lg text-center">
            <h2 className="text-lg font-semibold">Admissions Open! Nursery - Year 12</h2>
            <button className="mt-2 bg-orange-600 px-4 py-2 rounded-full">Register Now</button>
          </div>
        </section>

        {/* Location Cards */}
        <section className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-7 gap-6 text-center">
          {["Harare", "Bulawayo", "Mutare", "Gweru", "Masvingo", "Chinhoyi", "Marondera"].map((location) => (
            <div
              key={location}
              onClick={() => handleLocationClick(location)}
              className="bg-blue-100 p-4 rounded-lg shadow-lg cursor-pointer hover:bg-blue-200"
            >
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
