// routes/estudianteRoutes.jsx
import { Route } from "react-router-dom";
import RegistrarHoras from "../features/estudiante/RegistrarHoras";
import HistorialHoras from "../features/estudiante/HistorialHoras";
import EstudianteLayout from "../layouts/EstudianteLayout";
import RoleProtectedRoute from "./RoleProtectedRoute";

export function estudianteRoutes() {
  return (
    <Route 
      path="/estudiante" 
      element={
        <RoleProtectedRoute allowedRoles="estudiante">
          <EstudianteLayout />
        </RoleProtectedRoute>
      }
    >
      
      <Route path="historial" element={<HistorialHoras />} />
      <Route path="registrar" element={<RegistrarHoras />} />
    </Route>
  );
}
