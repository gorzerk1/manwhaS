import React from 'react';
import Navbar from "../components/navbar/Navbar.jsx";
import NewestUpdate from "../components/newestUpdate/NewestUpdate.jsx"

function UpdateWeb() {
  return (
    <>
     <Navbar onSearch={() => {}} />
     <NewestUpdate />
    </>
  );
}

export default UpdateWeb;
