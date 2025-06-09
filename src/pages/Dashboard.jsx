import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { jardins, plantes, contenus } from '../data/mockData';
import { MapPin, Sprout, Calendar, TrendingUp, ChevronRight, Plus, Leaf } from 'lucide-react';
import Layout from '../components/Layout';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const userGardens = jardins.filter(j => j.Jardinier === (currentUser ? currentUser.NumJardinier : null));
  const totalSuperficie = userGardens.reduce((sum, garden) => sum + garden.superficie, 0);
  const userContents = contenus.filter(c => 
    userGardens.some(g => g.NumJ === c.Jardin)
  );
  const totalPlantes = userContents.reduce((sum, content) => sum + content.quantite, 0);

  const recentPlantations = userContents
    .sort((a, b) => new Date(b.date_plantation).getTime() - new Date(a.date_plantation).getTime())
    .slice(0, 3)
    .map(content => {
      const garden = jardins.find(j => j.NumJ === content.Jardin);
      const plant = plantes.find(p => p.NumP === content.plante);
      return { ...content, garden, plant };
    });

  const stats = [
    {
      title: 'JARDINS GÉRÉS',
      value: userGardens.length,
      icon: MapPin,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'SUPERFICIE TOTALE',
      value: `${totalSuperficie} m²`,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      title: 'PLANTES CULTIVÉES',
      value: totalPlantes,
      icon: Sprout,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      title: 'PLANTATIONS RÉCENTES',
      value: recentPlantations.length,
      icon: Calendar,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Section de bienvenue avec message personnalisé */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-4 rounded-full">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Bienvenue {currentUser?.prenom} {currentUser?.NomJardinier} !
              </h1>
              <p className="text-emerald-100 text-lg">
                Jardinier depuis le {currentUser?.date_embauche ? new Date(currentUser.date_embauche).toLocaleDateString('fr-FR') : 'N/A'}
              </p>
              <p className="text-emerald-100">
                Gérez vos espaces verts en toute simplicité avec JardiGest.
              </p>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs font-medium tracking-wide uppercase">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-xl`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sections principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vos jardins */}
          <div className="bg-white rounded-xl shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Vos jardins</h2>
                </div>
                <button
                  onClick={() => navigate('/jardins')}
                  className="flex items-center text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
                >
                  Voir tout
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {userGardens.slice(0, 3).map((garden) => (
                  <div key={garden.NumJ} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <h3 className="font-semibold text-gray-900">{garden.nomJardin}</h3>
                      <p className="text-gray-600 text-sm">{garden.adresse}</p>
                      <p className="text-gray-500 text-sm">{garden.ville}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        {garden.superficie} m²
                      </p>
                    </div>
                  </div>
                ))}
                {userGardens.length === 0 && (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Aucun jardin assigné</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Plantations récentes */}
          <div className="bg-white rounded-xl shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Plantations récentes</h2>
                </div>
                <button
                  onClick={() => navigate('/composition')}
                  className="flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors"
                >
                  Gérer
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentPlantations.map((plantation) => (
                  <div key={plantation.idContenue} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <h3 className="font-semibold text-gray-900">{plantation.plant?.NomP}</h3>
                      <p className="text-gray-600 text-sm">{plantation.garden?.nomJardin}</p>
                      <p className="text-gray-500 text-sm">
                        {new Date(plantation.date_plantation).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-purple-600">
                        {plantation.quantite} unités
                      </p>
                    </div>
                  </div>
                ))}
                {recentPlantations.length === 0 && (
                  <div className="text-center py-8">
                    <Sprout className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Aucune plantation récente</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;