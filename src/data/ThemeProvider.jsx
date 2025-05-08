import React, { useState, useEffect } from "react";

const MyContext = React.createContext();

function ThemeProvider({ children }) {
  const [descriptions, setDescriptions] = useState({});

  useEffect(() => {
    fetch("/data/jsonFiles") // must list folders
      .then(res => res.json())
      .then(async folders => {
        const allDescriptions = {};

        await Promise.all(
          folders.map(async (folder) => {
            const res = await fetch(`/data/jsonFiles/${folder}/manwhaDescription.json`);
            const data = await res.json();
            allDescriptions[folder] = data;
          })
        );

        setDescriptions(allDescriptions);
      })
      .catch(err => console.error("Failed to load descriptions", err));
  }, []);

  return (
    <MyContext.Provider value={{ descriptions }}>
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, ThemeProvider };
