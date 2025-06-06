import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.scss';
import FrontPage from './container/FrontPage';
import Series from './container/Series';
import ReadChapter from './container/ReadChapter';
import MainChapter from './components/mainChapter/MainChapter';
import ScrollChapter from './components/scrollChapter/ScrollChapter';
import TEST from "./test"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/series" element={<Series />} />
        <Route path="/readchapter/:mangaName/chapter/:chapterNumber" element={<ReadChapter />} />
        <Route path="/series/:mangaName" element={<Series />} />
        <Route path="/test" element={<ScrollChapter />} />
        <Route path="/test1" element={<TEST/>} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
