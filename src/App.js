import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.scss';
import FrontPage from './container/FrontPage';
import Series from './container/Series';
import ReadChapter from './container/ReadChapter';
import UpdateWeb from './container/UpdateWeb';
import Test from './test';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/series" element={<Series />} />
        <Route path="/readchapter/:mangaName/chapter/:chapterNumber" element={<ReadChapter />} />
        <Route path="/series/:mangaName" element={<Series />} />
        <Route path="/lastedUpdate" element={<UpdateWeb />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
