import { useState, useEffect, useCallback } from "react";
import axios from "../services/Api";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar si el usuario está autenticado y obtener su información
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setLoading(false);
      setUser(null);
      return;
    }

    try {
      const response = await axios.get("/usuario/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data);
      setError(null);
    } catch (err) {
      console.error("Error verificando autenticación:", err);
      // Si el token es inválido, limpiar localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setError("Sesión expirada");
    } finally {
      setLoading(false);
    }
  }, []);

  // Login
  const login = useCallback(async (username, password) => {
    try {
      const response = await axios.post("/token/", { username, password });
      const { access, refresh } = response.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      // Obtener datos del usuario
      const userResponse = await axios.get("/usuario/me", {
        headers: { Authorization: `Bearer ${access}` },
      });

      setUser(userResponse.data);
      setError(null);
      return userResponse.data;
    } catch (err) {
      setError("Error en el login");
      throw err;
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setError(null);
    setLoading(false);
  }, []);

  // Verificar si el usuario tiene un rol específico
  const hasRole = useCallback(
    (role) => {
      return user?.rol === role;
    },
    [user]
  );

  // Verificar si el usuario tiene permisos para acceder a una ruta
  const canAccess = useCallback(
    (allowedRoles) => {
      if (!user) return false;
      if (Array.isArray(allowedRoles)) {
        return allowedRoles.includes(user.rol);
      }
      return user.rol === allowedRoles;
    },
    [user]
  );

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    loading,
    error,
    login,
    logout,
    hasRole,
    canAccess,
    checkAuth,
  };
}
