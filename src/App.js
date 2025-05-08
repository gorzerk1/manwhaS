import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.scss';
import MainChapter from './components/mainChapter/MainChapter';





function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainChapter />} />
        <Route path="/readchapter/:mangaName/chapter/:chapterNumber" element={<MainChapter />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
