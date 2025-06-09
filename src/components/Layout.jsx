import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Leaf, MapPin, Settings, Home, Menu, X } from 'lucide-react';

const Layout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const handleNavigate = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-xl border-b-4 border-emerald-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-2 lg:p-3 rounded-xl shadow-lg">
                <Leaf className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  JardiGest
                </h1>
                <p className="text-xs lg:text-sm text-gray-600 font-medium hidden sm:block">Gestion Professionnelle d'Espaces Verts</p>
              </div>
            </div>

            {/* Navigation Desktop */}
            <nav className="hidden lg:flex space-x-2">
              <button
                onClick={() => navigate('/accueil')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isActive('/accueil')
                    ? 'bg-emerald-100 text-emerald-700 shadow-lg scale-105'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 hover:scale-105'
                }`}
              >
                <Home className="h-5 w-5" />
                <span>Accueil</span>
              </button>
              
              <button
                onClick={() => navigate('/jardins')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isActive('/jardins')
                    ? 'bg-emerald-100 text-emerald-700 shadow-lg scale-105'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 hover:scale-105'
                }`}
              >
                <MapPin className="h-5 w-5" />
                <span>Mes Jardins</span>
              </button>
              
              <button
                onClick={() => navigate('/composition')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isActive('/composition')
                    ? 'bg-emerald-100 text-emerald-700 shadow-lg scale-105'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 hover:scale-105'
                }`}
              >
                <Settings className="h-5 w-5" />
                <span>Composition</span>
              </button>
            </nav>

            {/* User Info & Actions */}
            <div className="flex items-center space-x-2 lg:space-x-6">
              {/* Welcome Message - Hidden on small screens */}
              <div className="text-right hidden lg:block">
                <p className="text-sm text-gray-600">Bienvenue</p>
                <p className="font-bold text-gray-900 text-lg">
                  {currentUser?.prenom} {currentUser?.NomJardinier}
                </p>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 lg:px-6 lg:py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <LogOut className="h-4 w-4 lg:h-5 lg:w-5" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg">
              {/* User Info for Mobile */}
              <div className="px-3 py-2 text-center border-b border-gray-100 mb-2">
                <p className="text-sm text-gray-600">Bienvenue</p>
                <p className="font-bold text-gray-900">
                  {currentUser?.prenom} {currentUser?.NomJardinier}
                </p>
              </div>

              {/* Navigation Links */}
              <button
                onClick={() => handleNavigate('/accueil')}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg font-medium transition-all duration-300 ${
                  isActive('/accueil')
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                <Home className="h-5 w-5" />
                <span>Accueil</span>
              </button>
              
              <button
                onClick={() => handleNavigate('/jardins')}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg font-medium transition-all duration-300 ${
                  isActive('/jardins')
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                <MapPin className="h-5 w-5" />
                <span>Mes Jardins</span>
              </button>
              
              <button
                onClick={() => handleNavigate('/composition')}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg font-medium transition-all duration-300 ${
                  isActive('/composition')
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                <Settings className="h-5 w-5" />
                <span>Composition</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;