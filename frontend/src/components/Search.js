import React, { useState } from "react";

function Search({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isclicked, setIsClicked] = useState(false);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };
  const handleSearchBoxClick = () => {
    setIsClicked(!isclicked);
  };
  return (
    <div className={`search-bar ${isclicked ? "clicked" : ""}`}>
      <input
        className="search-box"
        type="text"
        placeholder="Search by name or location"
        value={searchTerm}
        onClick={handleSearchBoxClick}
        onChange={handleSearch}
      />
    </div>
  );
}

export default Search;
