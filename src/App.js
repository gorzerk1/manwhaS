import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.scss';
import MainChapter from './components/mainChapter/MainChapter';
import ScrollChapter from './components/scrollChapter/ScrollChapter';





function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<ScrollChapter />} />
        <Route path="/readchapter/:mangaName/chapter/:chapterNumber" element={<ScrollChapter />} />
        <Route path="/series/:mangaName" element={<ScrollChapter />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
