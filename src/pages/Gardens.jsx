import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { jardins } from '../data/mockData';
import { MapPin, Search, Filter } from 'lucide-react';
import Layout from '../components/Layout';

const Gardens = () => {
  const { currentUser } = useAuth();
  const [selectedCity, setSelectedCity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const userGardens = jardins.filter(j => j.Jardinier === (currentUser ? currentUser.NumJardinier : null));
  
  const cities = [...new Set(userGardens.map(garden => garden.ville))];
  
  const filteredGardens = userGardens.filter(garden => {
    const matchCity = !selectedCity || garden.ville === selectedCity;
    const matchSearch = !searchTerm || 
      garden.nomJardin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      garden.adresse.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCity && matchSearch;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes jardins</h1>
          <p className="text-gray-600">
            Gérez et visualisez tous vos espaces verts
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher un jardin..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Toutes les villes</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGardens.map((garden) => (
              <div key={garden.NumJ} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {garden.nomJardin}
                    </h3>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    {garden.ville}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-gray-600 text-sm flex items-center">
                    <span className="font-medium">Adresse:</span>
                    <span className="ml-2">{garden.adresse}</span>
                  </p>
                  <p className="text-gray-600 text-sm flex items-center">
                    <span className="font-medium">Superficie:</span>
                    <span className="ml-2 text-green-600 font-semibold">
                      {garden.superficie} m²
                    </span>
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      Jardin #{garden.NumJ}
                    </div>
                    <button className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                      Voir détails
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredGardens.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun jardin trouvé
              </h3>
              <p className="text-gray-600">
                {selectedCity || searchTerm 
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Aucun jardin n\'est assigné à votre compte'
                }
              </p>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Statistiques de vos jardins
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {userGardens.length}
                  </p>
                  <p className="text-gray-600 text-sm">Jardins total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {cities.length}
                  </p>
                  <p className="text-gray-600 text-sm">Villes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {userGardens.reduce((sum, garden) => sum + garden.superficie, 0)}
                  </p>
                  <p className="text-gray-600 text-sm">m² total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {Math.round(userGardens.reduce((sum, garden) => sum + garden.superficie, 0) / userGardens.length) || 0}
                  </p>
                  <p className="text-gray-600 text-sm">m² moyen</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Gardens;