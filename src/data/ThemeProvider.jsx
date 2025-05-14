import React from "react";

const MyContext = React.createContext();

function ThemeProvider({ children }) {

  return (
    <MyContext.Provider value={{}}>
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, ThemeProvider };
