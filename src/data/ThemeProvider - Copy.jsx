import React, { useState, useEffect } from "react";

const MyContext = React.createContext();

function ThemeProvider({ children }) {
  const [descriptions, setDescriptions] = useState({});

  useEffect(() => {
    const folders = [
      "absolute-regression",
      "nano-machine",
      "myst-might-mayhem",
      "the-return-of-the-crazy-demon",
      "surviving-as-a-genius-on-borrowed-time",
      "swordmasters-youngest-son",
      "the-priest-of-corruption",
      "reincarnation-of-the-suicidal-battle-god",
      "sword-fanatic-wanders-through-the-night",
      "reaper-of-the-drifting-moon",
      "legend-of-asura-the-venom-dragon",
      "mookhyang-the-origin"
    ];

    const loadDescriptions = async () => {
      const allDescriptions = {};

      await Promise.all(
        folders.map(async (folder) => {
          try {
            const res = await fetch(`/data/jsonFiles/${folder}/manwhaDescription.json`);
            const data = await res.json();
            allDescriptions[folder] = data;
          } catch (err) {
            console.error(`❌ Failed loading ${folder} description`, err);
          }
        })
      );

      setDescriptions(allDescriptions);
    };

    loadDescriptions();
  }, []);

  return (
    <MyContext.Provider value={{ descriptions }}>
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, ThemeProvider };
