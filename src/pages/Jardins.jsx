import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { jardins as mockJardins, contenus } from '../data/mockData';
import { MapPin, Plus, Edit, Trash2, Users, Calendar, Leaf } from 'lucide-react';

const Jardins = () => {
  const { currentUser } = useAuth();
  
  // Utiliser les vraies données du mockData pour l'utilisateur connecté
  const userGardens = mockJardins.filter(j => j.Jardinier === (currentUser ? currentUser.NumJardinier : null));
  
  // Convertir le format pour la compatibilité avec le code existant
  const jardins = userGardens.map(garden => {
    const gardenContents = contenus.filter(c => c.Jardin === garden.NumJ);
    const nombrePlantes = gardenContents.reduce((sum, content) => sum + content.quantite, 0);
    
    return {
      id: garden.NumJ,
      nom: garden.nomJardin,
      adresse: `${garden.adresse}, ${garden.ville}`,
      superficie: garden.superficie,
      dateCreation: '2024-01-01', // Date par défaut
      statut: 'Actif',
      nombrePlantes: nombrePlantes,
      responsable: `${currentUser?.prenom || ''} ${currentUser?.NomJardinier || ''}`.trim()
    };
  });
  
  const [localJardins, setLocalJardins] = useState(jardins);

  const [showModal, setShowModal] = useState(false);
  const [editingJardin, setEditingJardin] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
    superficie: '',
    statut: 'Actif'
  });

  const handleEdit = (jardin) => {
    setEditingJardin(jardin);
    setFormData({
      nom: jardin.nom,
      adresse: jardin.adresse,
      superficie: jardin.superficie,
      statut: jardin.statut
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setDeleteTarget(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setLocalJardins(localJardins.filter(j => j.id !== deleteTarget));
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingJardin) {
      setLocalJardins(localJardins.map(j => 
        j.id === editingJardin.id 
          ? { ...j, ...formData, superficie: parseInt(formData.superficie) }
          : j
      ));
    } else {
      const newJardin = {
        id: Math.max(...localJardins.map(j => j.id)) + 1,
        ...formData,
        superficie: parseInt(formData.superficie),
        dateCreation: new Date().toISOString().split('T')[0],
        nombrePlantes: 0,
        responsable: `${currentUser?.prenom || ''} ${currentUser?.NomJardinier || ''}`.trim()
      };
      setLocalJardins([...localJardins, newJardin]);
    }
    setShowModal(false);
    setEditingJardin(null);
    setFormData({ nom: '', adresse: '', superficie: '', statut: 'Actif' });
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'Actif': return 'bg-green-100 text-green-800';
      case 'En maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Inactif': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Mes Jardins</h1>
            <p className="text-gray-600 mt-2">Gérez vos espaces verts en toute simplicité</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            <span>Nouveau Jardin</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="bg-emerald-100 p-3 rounded-xl">
                <Leaf className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Jardins</p>
                <p className="text-3xl font-bold text-gray-900">{jardins.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-xl">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Superficie Totale</p>
                <p className="text-3xl font-bold text-gray-900">
                  {jardins.reduce((total, j) => total + j.superficie, 0)} m²
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Plantes Totales</p>
                <p className="text-3xl font-bold text-gray-900">
                  {jardins.reduce((total, j) => total + j.nombrePlantes, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Jardins Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {localJardins.map((jardin) => (
            <div key={jardin.id} className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{jardin.nom}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(jardin)}
                      className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(jardin.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{jardin.adresse}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">Créé le {new Date(jardin.dateCreation).toLocaleDateString('fr-FR')}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatutColor(jardin.statut)}`}>
                      {jardin.statut}
                    </span>
                    <span className="text-sm text-gray-600">{jardin.superficie} m²</span>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Plantes: {jardin.nombrePlantes}</span>
                      <span className="text-gray-600">Resp: {jardin.responsable}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {editingJardin ? 'Modifier le jardin' : 'Nouveau jardin'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom du jardin</label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <input
                    type="text"
                    value={formData.adresse}
                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Superficie (m²)</label>
                  <input
                    type="number"
                    value={formData.superficie}
                    onChange={(e) => setFormData({ ...formData, superficie: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    value={formData.statut}
                    onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="Actif">Actif</option>
                    <option value="En maintenance">En maintenance</option>
                    <option value="Inactif">Inactif</option>
                  </select>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingJardin(null);
                      setFormData({ nom: '', adresse: '', superficie: '', statut: 'Actif' });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    {editingJardin ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de confirmation de suppression */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Confirmer la suppression</h3>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500">
                  Êtes-vous sûr de vouloir supprimer ce jardin ? Cette action est irréversible et toutes les données associées (plantes, compositions) seront définitivement perdues.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Jardins;