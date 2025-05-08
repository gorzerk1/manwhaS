import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.scss';
import Cards from './components/cards/Cards';





function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Cards />} />
        <Route path="/readchapter/:mangaName/chapter/:chapterNumber" element={<Cards />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
