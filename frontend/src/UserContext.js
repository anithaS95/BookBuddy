// UserContext.js
import React, { createContext, useState, useContext } from 'react';

// Create a new context
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // Example state for theme

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <UserContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook for using the context
export const useUserContext = () => {
  return useContext(UserContext);
};
