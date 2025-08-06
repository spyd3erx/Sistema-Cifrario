import { useEffect } from "react";


export default function NotFound() {

    useEffect(() => {
        document.title = "404 - Página no encontrada";
    }, []);
    
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-lg w-full text-center">
                <div className="mb-8">
                    <img src="/404.webp" alt="404" className="w-64 h-64 mx-auto  flex items-center justify-center" />
                </div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">¡Ups! Página no encontrada</h1>
                <p className="text-gray-600 mb-8">Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
                <a 
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
                >
                    Volver al inicio
                </a>
            </div>
        </div>
    )
}