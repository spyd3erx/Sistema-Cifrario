// routes/AppRouter.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useMemo } from "react";
import Login from "../features/auth/Login";
import NotFound from "../pages/NotFound";
import { estudianteRoutes } from "./EstudianteRoutes";
import { supervisorRoutes } from "./SupervisorRoutes";
import { useAuth } from "../hooks/useAuth";

function AppRoutes() {
  const { user, loading } = useAuth();

  // Memoizar las rutas para evitar re-renderizados innecesarios
  const routes = useMemo(() => {
    return (
      <>
        {estudianteRoutes()}
        {supervisorRoutes()}
      </>
    );
  }, []);

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Ruta pública */}
      <Route 
        path="/" 
        element={
          user ? (
            <Navigate 
              to={
                user.rol === "estudiante" 
                  ? "/estudiante/historial" 
                  : "/supervisor/ver-horas"
              } 
              replace 
            />
          ) : (
            <Login />
          )
        } 
      />

      {/* Rutas por rol */}
      {routes}

      {/* Ruta 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function AppRouter() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
