/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Series from './pages/Series';
import LatestUpdates from './pages/LatestUpdates';
import Reader from './pages/Reader';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lastedUpdate" element={<LatestUpdates />} />
        <Route path="/series/:mangaName" element={<Series />} />
        <Route path="/readchapter/:mangaName/chapter/:chapterNumber" element={<Reader />} />
      </Routes>
    </BrowserRouter>
  );
}
