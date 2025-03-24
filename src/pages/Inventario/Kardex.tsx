import { useState, useEffect } from "react";
import axios from "axios";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

interface Producto {
  id: number;
  nombreProducto: string;
}

interface Filtro {
  idProducto: number;
  fechaInicio: string | null;
  fechaFin: string | null;
}

export default function ConsultaRangos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filtro, setFiltro] = useState<Filtro>({
    idProducto: 0,
    fechaInicio: null,
    fechaFin: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setError("No hay token de acceso disponible.");
          return;
        }

        const response = await axios.post(
          "http://localhost:6061/api/v1/consultar-productos",
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.respuesta.esExitosa) {
          setProductos(response.data.resultados);
        } else {
          throw new Error("Error al obtener productos.");
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.respuesta?.mensaje || "Error al obtener productos.");
        } else {
          setError("Error desconocido al obtener productos.");
        }
      }
    };

    fetchProductos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "idProducto") {
      const idProductoNumber = isNaN(Number(value)) ? 0 : Number(value);
      setFiltro((prev) => ({
        ...prev,
        [name]: idProductoNumber,
      }));
    } else {
      setFiltro((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDescargarExcel = async () => {
    if (filtro.idProducto === 0) {
      setError("Es necesario seleccionar un producto.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("No hay token de acceso disponible.");
        return;
      }

      const response = await axios.post(
        "http://localhost:6061/api/v1/obtener-kardex",
        filtro,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.respuesta.esExitosa) {
        const base64String = response.data.resultado.base64;
        const fileName = response.data.resultado.nombreArchivo;

        const byteCharacters = atob(base64String);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
          const slice = byteCharacters.slice(offset, offset + 1024);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          byteArrays.push(new Uint8Array(byteNumbers));
        }

        const blob = new Blob(byteArrays, { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        setSuccess("Reporte descargado exitosamente.");
      } else {
        setError(response.data.respuesta.mensaje);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.respuesta?.mensaje || "Error al realizar la consulta.");
      } else {
        setError("Error desconocido al realizar la consulta.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleObtenerInformacionAdicional = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("No hay token de acceso disponible.");
        return;
      }

      const response = await axios.post(
        "http://localhost:6061/api/v1/obtener-kardex-valorizado", // Nuevo endpoint
        filtro,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.respuesta.esExitosa) {
        // Asumimos que la respuesta también tiene un archivo en base64
        const base64String = response.data.resultado.base64;
        const fileName = response.data.resultado.nombreArchivo;

        const byteCharacters = atob(base64String);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
          const slice = byteCharacters.slice(offset, offset + 1024);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          byteArrays.push(new Uint8Array(byteNumbers));
        }

        const blob = new Blob(byteArrays, { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        setSuccess("Información adicional descargada exitosamente.");
      } else {
        setError(response.data.respuesta.mensaje);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.respuesta?.mensaje || "Error al obtener información adicional.");
      } else {
        setError("Error desconocido al obtener información adicional.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageMeta title="CITIKOLD" description="" />
      <PageBreadcrumb pageTitle="Kardex" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
            Realiza consultas según el rango de fechas y selecciona un producto para obtener los resultados.
          </p>
        </div>

        <form className="space-y-6 mt-6">
          <div>
            <label className="block text-sm font-medium">Producto <span className="text-error-500">*</span></label>
            <select
              name="idProducto"
              className="border p-2 w-full rounded-md"
              value={filtro.idProducto}
              onChange={handleChange}
            >
              <option value={0}>Selecciona un producto</option>
              {productos.map((producto) => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombreProducto} - {producto.nombreProducto}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Fecha de Inicio</label>
            <input
              type="date"
              name="fechaInicio"
              className="border p-2 w-full rounded-md"
              value={filtro.fechaInicio || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Fecha de Fin</label>
            <input
              type="date"
              name="fechaFin"
              className="border p-2 w-full rounded-md"
              value={filtro.fechaFin || ""}
              onChange={handleChange}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <div className="space-x-4">
            <button
              type="button"
              onClick={handleDescargarExcel}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md"
              disabled={loading}
            >
              {loading ? "Consultando..." : "Descargar Reporte Kardex"}
            </button>
            {/* Nuevo botón para obtener información adicional y descargarla */}
            <button
              type="button"
              onClick={handleObtenerInformacionAdicional}
              className="w-full bg-green-500 text-white px-4 py-2 rounded-md mt-4"
              disabled={loading}
            >
              {loading ? "Consultando..." : "Descargar Reporte Kardex valorizado"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
