import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    // Charger les utilisateurs enregistrés
    const savedRegisteredUsers = localStorage.getItem('registeredUsers');
    if (savedRegisteredUsers) {
      setRegisteredUsers(JSON.parse(savedRegisteredUsers));
    }
  }, []);

  const login = async (username, password) => {
    // Données de démonstration pour la connexion
    const demoUsers = [
      {
        NumJardinier: 1,
        NomJardinier: 'Ben Ali',
        prenom: 'Ahmed',
        login: 'abenali',
        mdp: 'password123',
        date_embauche: '2024-01-15'
      }
    ];

    // Combiner les utilisateurs de démonstration avec les utilisateurs enregistrés
    const allUsers = [...demoUsers, ...registeredUsers];

    // Simuler un délai d'authentification
    await new Promise(resolve => setTimeout(resolve, 500));

    // Vérifier les identifiants (case sensitive)
    const user = allUsers.find(u => 
      u.login.toLowerCase() === username.toLowerCase() && 
      u.mdp === password
    );
    
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, user };
    }
    
    return { success: false, message: 'Nom d\'utilisateur ou mot de passe incorrect' };
  };

  const register = (userData) => {
    // Créer un nouvel utilisateur localement
    const newUser = {
      NumJardinier: Math.floor(Math.random() * 1000) + 3, // ID aléatoire
      NomJardinier: userData.nom,
      prenom: userData.prenom,
      login: userData.login,
      mdp: userData.mdp,
      date_embauche: userData.date_embauche
    };

    // Ajouter le nouvel utilisateur à la liste des utilisateurs enregistrés
    const updatedRegisteredUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedRegisteredUsers);
    localStorage.setItem('registeredUsers', JSON.stringify(updatedRegisteredUsers));

    // Connecter automatiquement l'utilisateur
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};