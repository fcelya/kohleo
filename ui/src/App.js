import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { AppProvider, useAppContext } from './AppContext';
import Login from './components/Login';
import Main from './components/Main';
import Content from './components/Content';
import Entry from './components/Entry';

import './App.css';
import './styles/custom.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3498db',
    },
    secondary: {
      main: '#2ecc71',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAppContext();
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/main" element={<ProtectedRoute><Main /></ProtectedRoute>} />
      <Route path="/content" element={<ProtectedRoute><Content /></ProtectedRoute>} />
      <Route path="/content/:id" element={<ProtectedRoute><Content /></ProtectedRoute>} />
      <Route path="/entry/:id" element={<ProtectedRoute><Entry /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <Router>
          <div className="App">
            <AppRoutes />
          </div>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
