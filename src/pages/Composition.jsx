import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { jardins, plantes, contenus } from '../data/mockData';
import { Trash2, Plus, Leaf, AlertCircle, Calendar, DollarSign, MapPin } from 'lucide-react';
import Layout from '../components/Layout';

const Composition = () => {
  const { currentUser } = useAuth();
  const [selectedJardin, setSelectedJardin] = useState(null);
  const [selectedPlante, setSelectedPlante] = useState(null);
  const [quantite, setQuantite] = useState(1);
  const [jardinContents, setJardinContents] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);

  const userGardens = jardins.filter(j => j.Jardinier === (currentUser ? currentUser.NumJardinier : null));

  useEffect(() => {
    if (selectedJardin) {
      const contents = contenus.filter(c => c.Jardin === selectedJardin);
      setJardinContents(contents);
      setSelectedContent(null);
    } else {
      setJardinContents([]);
      setSelectedContent(null);
    }
  }, [selectedJardin]);

  const handleAddPlante = () => {
    if (!selectedJardin || !selectedPlante || quantite <= 0) {
      return;
    }

    const newContent = {
      idContenue: Math.max(...contenus.map(c => c.idContenue), 0) + 1,
      Jardin: selectedJardin,
      plante: selectedPlante,
      quantite: quantite,
      date_plantation: new Date().toISOString().split('T')[0]
    };

    contenus.push(newContent);
    const updatedContents = contenus.filter(c => c.Jardin === selectedJardin);
    setJardinContents(updatedContents);
    setSelectedPlante(null);
    setQuantite(1);
  };

  const handleRemovePlante = () => {
    if (!selectedContent) return;

    const contentIndex = contenus.findIndex(c => c.idContenue === selectedContent);
    if (contentIndex !== -1) {
      contenus.splice(contentIndex, 1);
      const updatedContents = contenus.filter(c => c.Jardin === selectedJardin);
      setJardinContents(updatedContents);
      setSelectedContent(null);
    }
  };

  const getPlanteName = (planteId) => {
    const plante = plantes.find(p => p.NumP === planteId);
    return plante ? plante.NomP : 'Plante inconnue';
  };

  const getPlanteDetails = (planteId) => {
    const plante = plantes.find(p => p.NumP === planteId);
    return plante || { NomP: 'Inconnu', origine: 'Inconnue', prix: 0 };
  };

  const selectedJardinData = jardins.find(j => j.NumJ === selectedJardin);
  const totalValue = jardinContents.reduce((total, content) => {
    const plante = getPlanteDetails(content.plante);
    return total + (plante.prix * content.quantite);
  }, 0);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-4 rounded-xl shadow-lg">
              <Leaf className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Composition des Jardins</h1>
              <p className="text-gray-600 mt-2 text-lg">Gérez la composition de vos espaces verts professionnels</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Selection & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Garden Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-6 w-6 mr-2 text-emerald-600" />
                Sélectionner un jardin
              </h3>
              
              <select
                value={selectedJardin || ''}
                onChange={(e) => setSelectedJardin(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-lg"
              >
                <option value="">Choisissez un jardin...</option>
                {userGardens.map(garden => (
                  <option key={garden.NumJ} value={garden.NumJ}>
                    {garden.nomJardin} - {garden.ville}
                  </option>
                ))}
              </select>

              {selectedJardinData && (
                <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <h4 className="font-bold text-emerald-800 text-lg">{selectedJardinData.nomJardin}</h4>
                  <p className="text-emerald-700">{selectedJardinData.adresse}</p>
                  <p className="text-emerald-600">Superficie: {selectedJardinData.superficie} m²</p>
                </div>
              )}
            </div>

            {/* Add Plant */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Plus className="h-6 w-6 mr-2 text-green-600" />
                Ajouter une plante
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Espèce de plante
                  </label>
                  <select
                    value={selectedPlante || ''}
                    onChange={(e) => setSelectedPlante(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    disabled={!selectedJardin}
                  >
                    <option value="">Choisissez une plante...</option>
                    {plantes.map(plante => (
                      <option key={plante.NumP} value={plante.NumP}>
                        {plante.NomP} - {plante.origine} ({plante.prix} DHS)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Quantité
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantite}
                    onChange={(e) => setQuantite(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    disabled={!selectedJardin}
                  />
                </div>

                <button
                  onClick={handleAddPlante}
                  disabled={!selectedJardin || !selectedPlante || quantite <= 0}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <Plus className="h-5 w-5" />
                  <span>Ajouter la plante</span>
                </button>
              </div>
            </div>

            {/* Remove Plant */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Trash2 className="h-6 w-6 mr-2 text-red-600" />
                Supprimer une plante
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Plante à supprimer
                  </label>
                  <select
                    value={selectedContent || ''}
                    onChange={(e) => setSelectedContent(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    disabled={!selectedJardin || jardinContents.length === 0}
                  >
                    <option value="">Choisissez une plante...</option>
                    {jardinContents.map(content => (
                      <option key={content.idContenue} value={content.idContenue}>
                        {getPlanteName(content.plante)} (Qté: {content.quantite})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleRemovePlante}
                  disabled={!selectedContent}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <Trash2 className="h-5 w-5" />
                  <span>Supprimer la plante</span>
                </button>
              </div>
            </div>
          </div>

          {/* Garden Composition */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Leaf className="h-7 w-7 mr-3 text-emerald-600" />
                  Composition du jardin
                </h3>
                {selectedJardin && jardinContents.length > 0 && (
                  <div className="flex items-center space-x-2 bg-emerald-50 px-6 py-3 rounded-xl border border-emerald-200">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold text-lg">{totalValue.toFixed(2)} DHS</span>
                  </div>
                )}
              </div>

              {!selectedJardin ? (
                <div className="text-center py-20">
                  <AlertCircle className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">
                    Sélectionnez un jardin
                  </h4>
                  <p className="text-gray-600 text-lg">
                    Choisissez un jardin pour voir sa composition
                  </p>
                </div>
              ) : jardinContents.length === 0 ? (
                <div className="text-center py-20">
                  <Leaf className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">
                    Espace vide
                  </h4>
                  <p className="text-gray-600 text-lg">
                    Ajoutez des plantes pour commencer la composition
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jardinContents.map(content => {
                    const plante = getPlanteDetails(content.plante);
                    const isSelected = selectedContent === content.idContenue;
                    return (
                      <div 
                        key={content.idContenue} 
                        className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                          isSelected 
                            ? 'border-red-500 bg-red-50 shadow-xl scale-105' 
                            : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-lg hover:scale-102'
                        }`}
                        onClick={() => setSelectedContent(isSelected ? null : content.idContenue)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="font-bold text-gray-900 text-xl">
                            {plante?.NomP}
                          </h4>
                          <span className="bg-emerald-100 text-emerald-800 text-sm font-bold px-3 py-2 rounded-full">
                            {content.quantite} unités
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 font-medium">Origine:</span>
                            <span className="font-bold text-gray-900">{plante?.origine}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 font-medium">Prix unitaire:</span>
                            <span className="font-bold text-gray-900">{plante?.prix} DHS</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 font-medium flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Planté le:
                            </span>
                            <span className="font-bold text-gray-900">
                              {new Date(content.date_plantation).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                            <span className="text-emerald-600 font-bold text-lg">Total:</span>
                            <span className="text-xl font-bold text-emerald-600">
                              {((plante?.prix || 0) * content.quantite).toFixed(2)} DHS
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Composition;