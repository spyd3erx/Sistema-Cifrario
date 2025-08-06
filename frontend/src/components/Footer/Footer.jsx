export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 sm:py-6 flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-300 text-xs sm:text-sm">
            © {new Date().getFullYear()} Cifrario: Sistema de Horas Sociales. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
