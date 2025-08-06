import { useState, useEffect } from "react";
import axios from "../../services/Api";

export default function VerHorasRegistradas() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [evidenciaSeleccionada, setEvidenciaSeleccionada] = useState("");
  const [textosExpandidos, setTextosExpandidos] = useState({});

  useEffect(() => {
    obtenerRegistros();
  }, []);

  const obtenerRegistros = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await axios.get("/estudiante/horas/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRegistros(response.data);
      setError("");
    } catch (error) {
      console.error("Error al obtener registros:", error);

      if (error.response?.status === 401) {
        setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("Error al cargar los registros. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (evidencia) => {
    setEvidenciaSeleccionada(evidencia);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEvidenciaSeleccionada("");
  };

  const toggleTexto = (index, campo) => {
    const key = `${index}-${campo}`;
    setTextosExpandidos((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderizarTexto = (texto, index, campo, maxCaracteres = 50) => {
    if (!texto) return null;

    const key = `${index}-${campo}`;
    const estaExpandido = textosExpandidos[key];

    if (texto.length <= maxCaracteres) {
      return <span className="text-gray-900">{texto}</span>;
    }

    return (
      <div className="text-gray-900">
        {estaExpandido ? (
          <>
            <span>{texto}</span>
            <button
              onClick={() => toggleTexto(index, campo)}
              className="ml-2 text-emerald-600 hover:text-emerald-800 text-sm font-medium transition-colors"
            >
              Ver menos
            </button>
          </>
        ) : (
          <>
            <span>{texto.substring(0, maxCaracteres)}...</span>
            <button
              onClick={() => toggleTexto(index, campo)}
              className="ml-2 text-emerald-600 hover:text-emerald-800 text-sm font-medium transition-colors"
            >
              Ver más
            </button>
          </>
        )}
      </div>
    );
  };

  const formatearFecha = (fechaISO) => {
    try {
      const fecha = new Date(fechaISO);
      return fecha.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "America/Bogota",
      });
    } catch (error) {
      return fechaISO;
    }
  };

  const obtenerColorEstado = (estado) => {
    switch (estado.toLowerCase()) {
      case "aprobado":
        return "bg-green-100 text-green-800";
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "rechazado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const obtenerTextoEstado = (estado) => {
    switch (estado.toLowerCase()) {
      case "aprobado":
        return "Aprobado";
      case "pendiente":
        return "Pendiente";
      case "rechazado":
        return "Rechazado";
      default:
        return estado;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <svg
              className="animate-spin h-6 w-6 text-emerald-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-gray-600">Cargando registros...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Historial de Horas Registradas
          </h1>
          <p className="text-gray-600 mt-1">
            Revisa el estado de tus horas sociales registradas
          </p>
        </div>

        {registros.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay registros
            </h3>
            <p className="text-gray-500">
              Aún no has registrado ninguna hora social.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Evidencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Observación
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {registros.map((registro, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatearFecha(registro.fecha)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {registro.horas_registradas} horas
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      {renderizarTexto(
                        registro.descripcion,
                        index,
                        "descripcion",
                        60
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${obtenerColorEstado(
                          registro.estado
                        )}`}
                      >
                        {obtenerTextoEstado(registro.estado)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {registro.evidencia_url ? (
                        <button
                          onClick={() => abrirModal(registro.evidencia_url)}
                          className="text-emerald-600 hover:text-emerald-800 font-medium flex items-center transition-colors"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          Ver evidencia
                        </button>
                      ) : (
                        <span className="text-gray-400">Sin evidencia</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      {registro.observacion ? (
                        renderizarTexto(
                          registro.observacion,
                          index,
                          "observacion",
                          50
                        )
                      ) : (
                        <span className="text-gray-400">Sin observaciones</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para mostrar evidencia */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden shadow-xl">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Evidencia</h3>
              <button
                onClick={cerrarModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-4">
              <div className="flex justify-center">
                <img
                  src={evidenciaSeleccionada}
                  alt="Evidencia de horas sociales"
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-sm"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MCAxMDBDNjAgODguOTU0MyA2OC45NTQzIDgwIDgwIDgwSDExMEMxMjEuMDQ2IDgwIDEzMCA4OC45NTQzIDEzMCAxMDBDMTMwIDExMS4wNDYgMTIxLjA0NiAxMjAgMTEwIDEyMEg4MEM2OC45NTQzIDEyMCA2MCAxMTEuMDQ2IDYwIDEwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTEwMCAxNDBDMTEwLjQ1NyAxNDAgMTE5IDEzMS40NTcgMTE5IDEyMUMxMTkgMTEwLjU0MyAxMTAuNDU3IDEwMiAxMDAgMTAyQzg5LjU0MzQgMTAyIDgxIDExMC41NDMgODEgMTIxQzgxIDEzMS40NTcgODkuNTQzNCAxNDAgMTAwIDE0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                    e.target.alt = "Error al cargar la imagen";
                  }}
                />
              </div>
            </div>

            {/* Footer del modal */}
            <div className="flex justify-end p-4 border-t border-gray-200">
              <button
                onClick={cerrarModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
