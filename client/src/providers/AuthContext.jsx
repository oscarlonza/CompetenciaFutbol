import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../../firebaseConfig"; // Asegúrate de que la ruta sea correcta
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { isSupported as isAnalyticsSupported, getAnalytics } from 'firebase/analytics'; // Importa isSupported y getAnalytics de firebase/analytics

// Crear el contexto de autenticación
const AuthContext = createContext();

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Nueva bandera de carga

  useEffect(() => {
    // Verificar si Analytics es compatible en este entorno
    if (isAnalyticsSupported()) {
      // Inicializar Analytics solo si es compatible
      const analytics = getAnalytics();
    }

    // Verificar el estado de autenticación de Firebase al montar el componente
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
      setLoading(false); // Establecer la bandera de carga en falso
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    setUser(userCredential.user);
    localStorage.setItem("user", JSON.stringify(userCredential.user));
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};