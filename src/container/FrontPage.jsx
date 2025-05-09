import React, { useState } from "react";
import Navbar from "../components/navbar/Navbar.jsx";
import Cards from "../components/cards/Cards.jsx";

function FrontPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Navbar onSearch={setSearchQuery} />
      <Cards searchQuery={searchQuery} />
    </>
  );
}

export default FrontPage;
