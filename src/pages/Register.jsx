import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, UserPlus, User, Lock, CheckCircle, Calendar } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    NomJardinier: '',
    prenom: '',
    login: '',
    mdp: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    if (formData.mdp !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    if (formData.mdp.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setIsLoading(false);
      return;
    }

    // Simuler un délai d'inscription
    setTimeout(() => {
      try {
        const userData = {
          nom: formData.NomJardinier,
          prenom: formData.prenom,
          login: formData.login,
          mdp: formData.mdp,
          date_embauche: new Date().toISOString().split('T')[0],
        };
        
        const success = register(userData);
        
        if (success) {
          setSuccess(true);
          setTimeout(() => navigate('/jardins'), 2000);
        } else {
          setError("Erreur lors de l'inscription");
        }
      } catch (error) {
        console.error('Register error:', error);
        setError("Ce nom d'utilisateur existe déjà");
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Inscription Réussie !</h2>
            <p className="text-gray-600 mb-6">
              Votre compte jardinier a été créé avec succès. Vous allez être redirigé vers votre espace personnel.
            </p>
            <div className="bg-emerald-50 p-4 rounded-xl">
              <p className="text-emerald-700 font-medium">
                Date d'embauche : {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 flex items-center justify-center px-4 overflow-hidden">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-xl mb-2">
            <Leaf className="h-6 w-6 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">JardiGest</h1>
          <p className="text-emerald-100 text-xs">Rejoignez notre équipe de jardiniers</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-xl shadow-2xl p-5">
          <div className="text-center mb-4">
            <UserPlus className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
            <h2 className="text-xl font-bold text-gray-900">Créer votre compte</h2>
            <p className="text-gray-600 text-xs mt-1">Inscrivez-vous pour commencer</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="prenom" className="block text-xs font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                <input
                  id="prenom"
                  name="prenom"
                  type="text"
                  required
                  value={formData.prenom}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  placeholder="Votre prénom"
                />
              </div>

              <div>
                <label htmlFor="NomJardinier" className="block text-xs font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  id="NomJardinier"
                  name="NomJardinier"
                  type="text"
                  required
                  value={formData.NomJardinier}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login" className="block text-xs font-medium text-gray-700 mb-1">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="login"
                  name="login"
                  type="text"
                  required
                  value={formData.login}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  placeholder="Choisir un nom d'utilisateur"
                />
              </div>
            </div>

            <div>
              <label htmlFor="mdp" className="block text-xs font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="mdp"
                  name="mdp"
                  type="password"
                  required
                  value={formData.mdp}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  placeholder="Créer un mot de passe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 mb-1">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  placeholder="Confirmer le mot de passe"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-sm disabled:opacity-50 disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Inscription en cours...
                </div>
              ) : (
                <span>Créer mon compte</span>
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-gray-600 text-xs">
              Déjà jardinier ?{' '}
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;