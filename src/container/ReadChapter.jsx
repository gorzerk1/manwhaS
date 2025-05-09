import React from 'react';
import Navbar from "../components/navbar/Navbar.jsx";
import Chapter from "../components/chapter/Chapter.jsx";

function ReadChapter() {
  return (
    <>
     <Navbar onSearch={() => {}} />
     <Chapter />
    </>
  );
}

export default ReadChapter;
