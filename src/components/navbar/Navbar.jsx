import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./navbar.scss";
import logo from "../../pictures/logoT.png";

function Navbar({ onSearch }) {
  const navigate = useNavigate();
  const [input, setInput] = useState("");

  const handleSearch = () => {
    navigate("/"); // navigate to home
    onSearch(input); // then trigger search
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="Navbar">
      <div className="Navbar--container">
        <div className="Navbar--container--leftSide">
          <div className="Navbar--container--leftSide--logo">
            <img src={logo} alt="Logo" />
          </div>
          <div className="Navbar--container--leftSide--home" onClick={() => navigate("/")}>
            Home
          </div>
          <div className="Navbar--container--leftSide--newestChap" onClick={() => navigate("/lastedUpdate")}>Newest Chapter</div>
        </div>

        <div className="Navbar--container--search">
          <input
            type="text"
            placeholder="Search..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div
            className="Navbar--container--search__icon"
            onClick={handleSearch}
            style={{ cursor: "pointer" }}
          >
            <img src="/searchIcon.png" alt="search" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
