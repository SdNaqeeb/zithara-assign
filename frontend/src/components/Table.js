import React from "react";

function Table({ data, searchTerm, onSort }) {
  const filteredData = data.filter((item) => {
    const searchString = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchString) ||
      item.location.toLowerCase().includes(searchString)
    );
  });

  return (
    <div>
      {data?.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Sno</th>
              <th>Customer Name</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Location</th>
              <th onClick={() => onSort("date")}>Date</th>
              <th onClick={() => onSort("time")}>Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.sno}</td>
                <td>{item.name}</td>
                <td>{item.age}</td>
                <td>{item.phone}</td>
                <td>{item.location}</td>
                <td>{item.date}</td>
                <td>{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!data?.length && <p>Loading data...</p>}
    </div>
  );
}

export default Table;
