import React, { useState, useEffect, createContext } from 'react';

const MyContext = createContext();
const BACKEND_URL = "http://<your-ec2-ip>:4000/mangaData.json"; // ← backend must serve this

function ThemeProvider({ children }) {
  const [mangaData, setMangaData] = useState(null);

  useEffect(() => {
    fetch(BACKEND_URL)
      .then(res => res.json())
      .then(data => setMangaData(data))
      .catch(err => console.error("❌ Failed to load manga data:", err));
  }, []);

  if (!mangaData) return <div>Loading...</div>;

  return (
    <MyContext.Provider value={{ mangaData }}>
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, ThemeProvider };
