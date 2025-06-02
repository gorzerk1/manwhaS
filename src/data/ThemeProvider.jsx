import React, { useState } from "react";

const MyContext = React.createContext();

function ThemeProvider({ children }) {
  const [API_BASE, setAPI_BASE] = useState("https://server.manhwawut.online");

  return (
    <MyContext.Provider value={{ API_BASE, setAPI_BASE }}>
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, ThemeProvider };
