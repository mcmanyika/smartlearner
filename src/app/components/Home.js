"use client";
import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Home = () => {
  const [filterName, setFilterName] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterCurriculum, setFilterCurriculum] = useState("");
  const [filterFeeRange, setFilterFeeRange] = useState("");
  const [filterOwnership, setFilterOwnership] = useState("");

  const router = useRouter();

  const [currentAd, setCurrentAd] = useState(0);

  const ads = [
    {
      title: "Divaris Makaharis",
      link: "https://divarismakaharis.com",
      bgColor: "bg-purple-700",
    },
    {
      title: "Glenview 2 High School",
      link: "https://glenview2high.com",
      bgColor: "bg-blue-500",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prevAd) => (prevAd + 1) % ads.length);
    }, 5000); // Change ad every 5 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [ads.length]);

  const handleSearch = async () => {
    const queryParams = new URLSearchParams({
      ...(filterName && { schoolName: filterName }),
      ...(filterLocation && { location: filterLocation }),
      ...(filterCurriculum && { curriculum: filterCurriculum }),
      ...(filterFeeRange && { feeRange: filterFeeRange }),
      ...(filterOwnership && { ownership: filterOwnership }),
    }).toString();

    router.push(`/libs/schools${queryParams ? `?${queryParams}` : ''}`);
  };

  const handleLocationClick = async (location) => {
    router.push(`/libs/schools?location=${encodeURIComponent(location)}`);
  };

  return (
    <div
      className="bg-cover bg-center min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/harare.png')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
        <div className="bg-gradient-to-b from-gray-900 to-transparent opacity-80 absolute inset-0"></div>
        <div className="relative z-10 w-full max-w-5xl text-center p-6  rounded-lg shadow-lg">
      
        {/* Header */}
        <header className="text-center pt-20 pb-10">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">School Finder</h1>
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
          <div
            className={`${ads[currentAd].bgColor} text-white p-4 rounded-lg text-center`}
          >
            <div className="text-xs text-left text-gray-300">Sponsered AD</div>
            <h2 className="text-3xl font-semibold">{ads[currentAd].title}</h2>
            <a
              href={ads[currentAd].link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block bg-orange-600 px-4 py-2 rounded-full hover:bg-orange-700 transition"
            >
              ENROLL NOW
            </a>
          </div>
        </section>

        {/* Location Cards */}
        <section className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {["Harare", "Bulawayo", "Mutare", "Gweru", "Masvingo", "Chinhoyi", "Marondera", "Bindura"].map((location) => (
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
        <section className="max-w-5xl mx-auto mb-8">
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1376209402491765"
     crossorigin="anonymous"></script>
        </section>
      </div>
    </div>
  );
};

export default Home;
