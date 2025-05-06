import React from 'react';
import MainChapter from '../components/mainChapter/MainChapter';
import ScrollChapter from '../components/scrollChapter/ScrollChapter';
import Navbar from '../components/navbar/Navbar.jsx';

function Series() {
  return (
    <>
     <Navbar />
     <MainChapter />
     <ScrollChapter/>
    </>
  );
}

export default Series;
