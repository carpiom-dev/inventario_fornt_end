import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

interface Producto {
  id: number;
  nombreProducto: string;
}

interface Stock {
  idProducto: number;
  cantidad: number;
  precioUnitario: number;
}

export default function AgregarStock() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [stock, setStock] = useState<Stock>({
    idProducto: 0,
    cantidad: 0,
    precioUnitario: 0,
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
    setStock((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
        "http://localhost:6061/api/v1/agregar-stock",
        stock,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.esExitosa) {
        setSuccess("Stock agregado exitosamente.");
        setStock({ idProducto: 0, cantidad: 0, precioUnitario: 0 }); // Limpiar los campos
        setTimeout(() => {
          navigate("/stock"); // Redirige a la lista de stocks después de agregar
        }, 2000); // Esperar 2 segundos para mostrar el mensaje de éxito
      } else {
        setError(response.data.mensaje);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.mensaje || "Error al agregar el stock.");
      } else {
        setError("Error desconocido al agregar el stock.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageMeta title="CITIKOLD" description="" />
      <PageBreadcrumb pageTitle="Stock" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
            Ingresa los detalles para agregar stock a un producto.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div>
            <label className="block text-sm font-medium">Producto <span className="text-error-500">*</span></label>
            <select
              name="idProducto"
              className="border p-2 w-full rounded-md"
              value={stock.idProducto}
              onChange={handleChange}
            >
              <option value={0}>Selecciona un producto</option>
              {productos.map((producto) => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombreProducto}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Cantidad <span className="text-error-500">*</span></label>
            <input
              type="number"
              name="cantidad"
              className="border p-2 w-full rounded-md"
              placeholder="Cantidad"
              value={stock.cantidad || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Precio Unitario <span className="text-error-500">*</span></label>
            <input
              type="number"
              name="precioUnitario"
              className="border p-2 w-full rounded-md"
              placeholder="Precio Unitario"
              value={stock.precioUnitario || ""}
              onChange={handleChange}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <div>
            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md"
              disabled={loading}
            >
              {loading ? "Agregando..." : "Agregar Stock"}
            </button>
          </div>
        </form>

        <div className="mt-5 text-center">
          <button 
            onClick={() => navigate("/stock")} 
            className="text-sm text-gray-700 dark:text-gray-400 hover:text-brand-500"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
