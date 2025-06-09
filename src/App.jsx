import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Jardins from './pages/Jardins';
import Composition from './pages/Composition';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/accueil" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/jardins" 
              element={
                <ProtectedRoute>
                  <Jardins />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/composition" 
              element={
                <ProtectedRoute>
                  <Composition />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/accueil" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;