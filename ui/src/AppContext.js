import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [entries, setEntries] = useState([]);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  const addEntry = (entry) => setEntries([...entries, entry]);
  const updateEntry = (id, updatedEntry) => {
    setEntries(entries.map(entry => entry.id === id ? { ...entry, ...updatedEntry } : entry));
  };

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      entries,
      addEntry,
      updateEntry
    }}>
      {children}
    </AppContext.Provider>
  );
};
