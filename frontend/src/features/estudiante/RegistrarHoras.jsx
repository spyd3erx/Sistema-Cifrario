import { useState } from "react";
import axios from "../../services/Api";

export default function RegistrarHoras() {
  const [fecha, setFecha] = useState("");
  const [horasRegistradas, setHorasRegistradas] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [evidencia, setEvidencia] = useState(null);
  const [fechaError, setFechaError] = useState("");
  const [horasError, setHorasError] = useState("");
  const [descripcionError, setDescripcionError] = useState("");
  const [evidenciaError, setEvidenciaError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Obtener la fecha actual en zona horaria de Bogotá en formato YYYY-MM-DD
  const fechaActual = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Bogota",
  });

  const handleFechaChange = (e) => {
    const fechaSeleccionada = e.target.value;
    setFecha(fechaSeleccionada);

    // Validar que la fecha no sea futura
    if (fechaSeleccionada > fechaActual) {
      setFechaError("No puedes seleccionar una fecha futura");
    } else {
      setFechaError("");
    }
  };

  const handleHorasChange = (e) => {
    const valor = e.target.value;
    setHorasRegistradas(valor);

    // Validar que las horas sean válidas
    if (valor === "") {
      setHorasError("");
    } else {
      const horas = parseFloat(valor);
      if (isNaN(horas) || horas <= 0) {
        setHorasError("Las horas deben ser un número mayor a 0");
      } else if (horas > 8) {
        setHorasError("Las horas no pueden ser mayores a 8");
      } else {
        setHorasError("");
      }
    }
  };

  const handleDescripcionChange = (e) => {
    const valor = e.target.value;
    setDescripcion(valor);

    // Validar que la descripción no esté vacía
    if (valor.trim().length === 0) {
      setDescripcionError("La descripción es obligatoria");
    } else if (valor.trim().length < 10) {
      setDescripcionError("La descripción debe tener al menos 10 caracteres");
    } else {
      setDescripcionError("");
    }
  };

  const handleEvidenciaChange = (e) => {
    const archivo = e.target.files[0];
    setEvidencia(archivo);

    // Validar el archivo
    if (archivo) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

      if (archivo.size > maxSize) {
        setEvidenciaError("El archivo no puede ser mayor a 10MB");
        setEvidencia(null);
        e.target.value = "";
      } else if (!allowedTypes.includes(archivo.type)) {
        setEvidenciaError("Solo se permiten archivos JPG, PNG o WEBP");
        setEvidencia(null);
        e.target.value = "";
      } else {
        setEvidenciaError("");
      }
    } else {
      setEvidenciaError("");
    }
  };

  const validarFormulario = () => {
    let esValido = true;

    // Validar fecha
    if (!fecha) {
      setFechaError("La fecha es obligatoria");
      esValido = false;
    } else if (fecha > fechaActual) {
      setFechaError("No puedes seleccionar una fecha futura");
      esValido = false;
    }

    // Validar horas
    if (!horasRegistradas) {
      setHorasError("Las horas registradas son obligatorias");
      esValido = false;
    } else {
      const horas = parseFloat(horasRegistradas);
      if (isNaN(horas) || horas <= 0) {
        setHorasError("Las horas deben ser un número mayor a 0");
        esValido = false;
      } else if (horas > 8) {
        setHorasError("Las horas no pueden ser mayores a 8");
        esValido = false;
      }
    }

    // Validar descripción
    if (!descripcion.trim()) {
      setDescripcionError("La descripción es obligatoria");
      esValido = false;
    } else if (descripcion.trim().length < 10) {
      setDescripcionError("La descripción debe tener al menos 10 caracteres");
      esValido = false;
    }

    return esValido;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpiar mensajes anteriores
    setSubmitSuccess(false);
    setSubmitError("");

    // Validar formulario
    if (!validarFormulario()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Crear FormData para enviar archivos
      const formData = new FormData();

      // Convertir fecha a formato ISO con zona horaria de Bogotá
      const fechaISO = new Date(fecha + "T12:00:00").toISOString();
      formData.append("fecha", fechaISO);

      formData.append("horas_registradas", parseFloat(horasRegistradas));
      formData.append("descripcion", descripcion);

      // Solo agregar evidencia si existe
      if (evidencia) {
        formData.append("evidencia", evidencia);
      }

      // Obtener token de autenticación
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      // Enviar formulario
      const response = await axios.post("estudiante/horas/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // NO establecer Content-Type manualmente para archivos
        },
      });

      // Éxito
      setSubmitSuccess(true);

      // Limpiar formulario
      setFecha("");
      setHorasRegistradas("");
      setDescripcion("");
      setEvidencia(null);
      setFechaError("");
      setHorasError("");
      setDescripcionError("");
      setEvidenciaError("");

      // Limpiar input de archivo
      const fileInput = document.getElementById("evidencia");
      if (fileInput) {
        fileInput.value = "";
      }

      console.log("Horas registradas exitosamente:", response.data);
    } catch (error) {
      console.error("Error al registrar horas:", error);

      if (error.response?.status === 401) {
        setSubmitError("Sesión expirada. Por favor, inicia sesión nuevamente.");
      } else if (error.response?.data?.message) {
        setSubmitError(error.response.data.message);
      } else if (error.message) {
        setSubmitError(error.message);
      } else {
        setSubmitError("Error al registrar las horas. Inténtalo de nuevo.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelar = () => {
    // Limpiar formulario
    setFecha("");
    setHorasRegistradas("");
    setDescripcion("");
    setEvidencia(null);
    setFechaError("");
    setHorasError("");
    setDescripcionError("");
    setEvidenciaError("");
    setSubmitSuccess(false);
    setSubmitError("");

    // Limpiar input de archivo
    const fileInput = document.getElementById("evidencia");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <>
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Registrar Horas Sociales
          </h2>
          <p className="text-gray-600">
            Ingresa los detalles de tus horas sociales realizadas
          </p>
        </div>

        {/* Mensajes de éxito y error */}
        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-green-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-green-800 font-medium">
                ¡Horas registradas exitosamente!
              </p>
            </div>
          </div>
        )}

        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
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
              <p className="text-red-800 font-medium">{submitError}</p>
            </div>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fecha */}
            <div>
              <label
                htmlFor="fecha"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Fecha de Realización *
              </label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={fecha}
                max={fechaActual}
                onChange={handleFechaChange}
                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  fechaError ? "border-red-500" : "border-gray-300"
                }`}
              />
              {fechaError && (
                <p className="mt-1 text-sm text-red-600">{fechaError}</p>
              )}
            </div>

            {/* Horas Registradas */}
            <div>
              <label
                htmlFor="horas"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Horas Registradas *
              </label>
              <input
                type="number"
                id="horas"
                name="horas"
                value={horasRegistradas}
                onChange={handleHorasChange}
                min="0.1"
                max="8"
                step="0.1"
                placeholder="Ej: 2.5"
                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  horasError ? "border-red-500" : "border-gray-300"
                }`}
              />
              {horasError && (
                <p className="mt-1 text-sm text-red-600">{horasError}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Máximo 8 horas por día
              </p>
            </div>
          </div>

          {/* Evidencia*/}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="evidencia"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Evidencia (Opcional)
            </label>
            <input
              type="file"
              id="evidencia"
              name="evidencia"
              onChange={handleEvidenciaChange}
              accept=".jpg,.jpeg,.png,.webp"
              className={`block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-medium
                        file:bg-emerald-50 file:text-emerald-700
                        hover:file:bg-emerald-100
                        file:cursor-pointer
                        border rounded-lg
                        focus:outline-none focus:ring-2 
                        focus:ring-emerald-500 focus:border-transparent
                        ${
                          evidenciaError ? "border-red-500" : "border-gray-300"
                        }`}
            />
            {evidenciaError && (
              <p className="mt-1 text-sm text-red-600">{evidenciaError}</p>
            )}
            <p className="text-xs text-gray-500">
              Formatos permitidos: JPG, PNG, WEBP. Tamaño máximo: 10MB
            </p>
          </div>

          {/* Descripción */}
          <div>
            <label
              htmlFor="descripcion"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Descripción de Actividades *
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={descripcion}
              onChange={handleDescripcionChange}
              rows="4"
              className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                descripcionError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Describe las actividades realizadas..."
            ></textarea>
            {descripcionError && (
              <p className="mt-1 text-sm text-red-600">{descripcionError}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancelar}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
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
                  Registrando...
                </>
              ) : (
                "Registrar Horas"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
