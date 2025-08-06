import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import {UserInformation, Footer} from "../components";

export default function EstudianteLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header principal */}
      <header className="bg-gradient-to-r from-[#20c997]/90 to-[#1ba085]/90 backdrop-blur-lg shadow-lg flex-shrink-0 border-b border-[#20c997]/30">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo y título */}
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-1.5 rounded-lg flex-shrink-0">
                <img src="/logo.webp" alt="Logo" className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-white">Panel del Estudiante</h1>
                <p className="text-emerald-100 text-xs">Cifrario: Gestión de Horas Sociales</p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center space-x-2">

              <UserInformation info={user?.username || 'Estudiante'} rol="Estudiante" />

              {/* Botón de cerrar sesión */}
              <button
                onClick={handleLogout}
                className="bg-red-500/90 hover:bg-red-600/95 backdrop-blur-sm text-white px-3 sm:px-4 py-2.5 sm:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 sm:space-x-2 shadow-md hover:shadow-lg border border-red-400/60 hover:border-red-300/80"
              >
                <svg className="w-4 h-4 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>

              {/* Botón menú móvil */}
              <button
                onClick={toggleMobileMenu}
                className="sm:hidden bg-emerald-800/85 backdrop-blur-md p-2 rounded-lg text-white border border-emerald-600/60 shadow-sm hover:bg-emerald-700/90 hover:backdrop-blur-lg transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="sm:hidden bg-gradient-to-b from-emerald-700/95 to-emerald-800/95 backdrop-blur-md border-t border-emerald-600 shadow-lg">
            <div className="px-4 py-3 space-y-2">
              <Link
                to="/estudiante/registrar"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActiveRoute('/estudiante/registrar')
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-emerald-100 hover:bg-emerald-600 hover:text-white hover:shadow-sm'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Registrar Horas</span>
                </div>
              </Link>
              
              <Link
                to="/estudiante/historial"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActiveRoute('/estudiante/historial')
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-emerald-100 hover:bg-emerald-600 hover:text-white hover:shadow-sm'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Historial</span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Navegación secundaria - Solo Desktop */}
      <nav className="hidden lg:block bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link
              to="/estudiante/registrar"
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 flex items-center space-x-2 ${
                isActiveRoute('/estudiante/registrar')
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-gray-600 hover:text-emerald-600 hover:border-emerald-300'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Registrar Horas</span>
            </Link>
            
            <Link
              to="/estudiante/historial"
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 flex items-center space-x-2 ${
                isActiveRoute('/estudiante/historial')
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-gray-600 hover:text-emerald-600 hover:border-emerald-300'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Historial</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="flex-1 px-4 py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto h-full">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Footer */}
    <Footer />
    </div>
  );
}


