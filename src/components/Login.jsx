import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(username, password);
      
      if (result.success) {
        navigate('/dashboard'); // Rediriger vers le tableau de bord
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-400 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">🌱</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">JardiGest</h1>
          <p className="text-gray-600">Gestion Professionnelle d'Espaces Verts</p>
        </div>

        <h2 className="text-xl font-semibold text-center mb-6">Connexion</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Nom d'utilisateur
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="abenali"
                required
              />
              <span className="absolute left-3 top-3 text-gray-400">👤</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="password123"
                required
              />
              <span className="absolute left-3 top-3 text-gray-400">🔒</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Nouveau jardinier ? <a href="/register" className="text-green-500 hover:underline">S'inscrire</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;