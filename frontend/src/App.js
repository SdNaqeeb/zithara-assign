import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Pagination from "./components/Pagination";
import Table from "./components/Table";
import Search from "./components/Search";

function App() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 20;
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState({
    field: "sno",
    order: "asc",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          `http://localhost:5000/data?page=${currentPage}&limit=${perPage}&sort=${sortCriteria.field}&order=${sortCriteria.order}`
        );
        setData(result.data.data);
        setTotalPages(Math.ceil(result.data.total.rows[0].count / perPage));
      } catch (err) {
        console.error(err);
      }
    };
if(!searchTerm){
    fetchData()};
  }, [currentPage, perPage, searchTerm, sortCriteria]);

  useEffect(() => {
    const handleSearch = async () => {
      try {
        const result = await axios.get(
          `http://localhost:5000/search?q=${searchTerm}`
        );
        setData(result.data.data);
        setTotalPages(1);
      } catch (err) {
        console.error(err);
      }
    };

    if (searchTerm) {
      handleSearch();
      setCurrentPage(1);
    }
  }, [searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSort = (field) => {
    setSortCriteria((prevSortCriteria) => {
      if (prevSortCriteria.field === field) {
        return {
          ...prevSortCriteria,
          order: prevSortCriteria.order === "asc" ? "desc" : "asc",
        };
      } else {
        return { field, order: "asc" };
      }
    });
    setCurrentPage(1);
  };

  return (
    <div className="App">
      <h1>Customer Data</h1>
      <Search onSearch={setSearchTerm} />
      <Table data={data} searchTerm={searchTerm} onSort={handleSort} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default App;
