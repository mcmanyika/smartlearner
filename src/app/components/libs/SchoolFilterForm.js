const SchoolFilterForm = ({ 
  filters, 
  handleFilterChange, 
  resetFilters, 
  uniqueLocations, 
  uniqueCurriculums, 
  uniqueFeeRanges, 
  uniqueOwnerships 
}) => {
  return (
    <div className="mb-8 bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Filter Schools</h2>
        <button
          onClick={resetFilters}
          className="text-sm text-gray-600 hover:text-blue-600"
        >
          Reset Filters
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <input
          type="text"
          name="schoolName"
          value={filters.schoolName}
          onChange={handleFilterChange}
          placeholder="School Name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
        
        <select
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Locations</option>
          {uniqueLocations.map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>

        <select
          name="curriculum"
          value={filters.curriculum}
          onChange={handleFilterChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Curriculums</option>
          {uniqueCurriculums.map(curriculum => (
            <option key={curriculum} value={curriculum}>{curriculum}</option>
          ))}
        </select>

        <select
          name="feeRange"
          value={filters.feeRange}
          onChange={handleFilterChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Fee Ranges</option>
          {uniqueFeeRanges.map(range => (
            <option key={range} value={range}>{range}</option>
          ))}
        </select>

        <select
          name="ownership"
          value={filters.ownership}
          onChange={handleFilterChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Ownerships</option>
          {uniqueOwnerships.map(ownership => (
            <option key={ownership} value={ownership}>{ownership}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SchoolFilterForm; 