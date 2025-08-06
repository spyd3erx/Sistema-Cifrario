// routes/supervisorRoutes.jsx
import { Route } from "react-router-dom";
import VerHoras from "../features/supervisor/VerHoras";
import CalificarHoras from "../features/supervisor/CalificarHoras";
import SupervisorLayout from "../layouts/SupervisorLayout";
import RoleProtectedRoute from "./RoleProtectedRoute";

export function supervisorRoutes() {
  return (
    <Route 
      path="/supervisor" 
      element={
        <RoleProtectedRoute allowedRoles="supervisor">
          <SupervisorLayout />
        </RoleProtectedRoute>
      }
    >
      <Route path="ver-horas" element={<VerHoras />} />
      <Route path="calificar" element={<CalificarHoras />} />
    </Route>
  );
}