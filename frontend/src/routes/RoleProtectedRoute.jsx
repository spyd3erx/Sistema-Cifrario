import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function RoleProtectedRoute({ children, allowedRoles }) {
  const { user, loading, canAccess } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Si el usuario no tiene permisos para esta ruta
  if (!canAccess(allowedRoles)) {
    // Redirigir según el rol del usuario
    if (user.rol === "estudiante") {
      return <Navigate to="/estudiante/historial" replace />;
    } else if (user.rol === "supervisor") {
      return <Navigate to="/supervisor/ver-horas" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // Si tiene permisos, mostrar el contenido
  return children;
} 