import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const userData = await login(username, password);
      
      // Redirigir según el rol
      if (userData.rol === "estudiante") {
        navigate("/estudiante/historial");
      } else if (userData.rol === "supervisor") {
        navigate("/supervisor/ver-horas");
      } else {
        setError("Rol no autorizado");
      }

    } catch (err) {
      console.error("Error en login:", err);
      if (err.response?.status === 401) {
        setError("Credenciales inválidas");
      } else if (err.response?.status === 400) {
        setError("Datos de entrada inválidos");
      } else {
        setError("Error del servidor. Inténtalo de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      {/* Imagen de fondo */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: "url('/backgroud_login.webp')"
        }}
      ></div>

      <div className="relative z-10 flex flex-col items-center w-100">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-100 backdrop-blur-sm bg-opacity-95"
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 tracking-tight">
            Iniciar sesión
          </h2>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 text-sm animate-fade-in">
              {error}
            </div>
          )}

          <div className="mb-4 space-y-2">
            <label className="block text-gray-700 text-sm font-semibold tracking-wide">Usuario</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 
                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                placeholder-gray-400 transition-all duration-200 ease-in-out
                disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Ingresa tu usuario"
                required
                disabled={isLoading}
              />
              <span className="absolute right-3 top-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
            </div>
          </div>

          <div className="mb-8 space-y-2">
            <label className="block text-gray-700 text-sm font-semibold tracking-wide">Contraseña</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3
                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                placeholder-gray-400 transition-all duration-200 ease-in-out
                disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Ingresa tu contraseña"
                required
                disabled={isLoading}
              />
              <span className="absolute right-3 top-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full font-semibold py-3 rounded-lg shadow-sm transform active:scale-95 transition duration-200 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </span>
            ) : (
              "Ingresar"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
