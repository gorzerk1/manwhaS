import React from "react";
import "./navbar.scss";
import logo from "../../pictures/logoT.png";

function Navbar() {
 
  return (
    <div className="Navbar">
      <div>
        <img src={logo} alt="Logo" />
      </div>
      
      <div>Home</div>

    </div>
  );
}

export default Navbar;
