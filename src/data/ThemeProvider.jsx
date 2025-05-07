// ThemeProvider.jsx
import React, { useState, useEffect } from 'react';
import mangaData from "../data/manhwa_metadata.json"; // adjust path if needed

const MyContext = React.createContext();

function ThemeProvider({ children }) {
  return (
    <MyContext.Provider value={{ mangaData }}>
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, ThemeProvider };
