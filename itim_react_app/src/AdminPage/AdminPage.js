// import React, { useEffect, useState } from "react";
import "./AdminPage.css"; // Import CSS file


const AdminPage = () => {
  return (
    <div className="admin-page">
      <div className="header">
        <h1>Admin Page</h1>
        <button className="return-button">Return</button>
      </div>
      <div className="body">
        <div className="table-container">
          <table className="table">
          </table>
        </div>
      </div>
    </div>
  );
};

export { AdminPage };
