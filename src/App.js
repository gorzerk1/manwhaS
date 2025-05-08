import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.scss';
import Chapter from './components/chapter/Chapter';




function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Chapter />} />
        <Route path="/readchapter/:mangaName/chapter/:chapterNumber" element={<Chapter />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
