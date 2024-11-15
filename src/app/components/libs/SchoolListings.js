"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { database } from "../../../../utils/firebaseConfig";
import { ref, onValue } from "firebase/database";

const SchoolListings = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetching search parameters
  const searchParams = useSearchParams();

  const filterName = searchParams.get("name") || "";
  const filterLocation = searchParams.get("location") || "";
  const filterCurriculum = searchParams.get("curriculum") || "";
  const filterFeeRange = searchParams.get("feeRange") || "";
  const filterOwnership = searchParams.get("ownership") || "";

  useEffect(() => {
    const schoolsRef = ref(database, "schools");
    onValue(schoolsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const schoolList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setSchools(schoolList);
      } else {
        setSchools([]);
      }
      setLoading(false);
    });
  }, []);

  // Filter function
  const filterSchools = (school) => {
    return (
      (filterName === "" || school.schoolName.toLowerCase().includes(filterName.toLowerCase())) &&
      (filterLocation === "" || school.location === filterLocation) &&
      (filterCurriculum === "" || school.curriculum === filterCurriculum) &&
      (filterFeeRange === "" || school.feeRange === filterFeeRange) &&
      (filterOwnership === "" || school.ownership === filterOwnership)
    );
  };

  // Memoized filtered schools for performance optimization
  const filteredSchools = useMemo(() => schools.filter(filterSchools), [
    schools,
    filterName,
    filterLocation,
    filterCurriculum,
    filterFeeRange,
    filterOwnership,
  ]);

  return (
    <div className="w-full p-4 bg-white text-sm">
      {loading ? (
        <p>Loading...</p>
      ) : filteredSchools.length === 0 ? (
        <p>No schools found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchools.map((school) => (
            <div
              key={school.id}
              className="border border-gray-200 mb-3 shadow-sm p-4 rounded-xl text-center"
            >
              <h2 className="text-md font-semibold mb-2">{school.schoolName}</h2>
              <p>{school.location}</p>
              <p>{school.curriculum}</p>
              <p>{school.ownership}</p>
              <p className="text-sm text-gray-600">{school.feeRange}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchoolListings;
