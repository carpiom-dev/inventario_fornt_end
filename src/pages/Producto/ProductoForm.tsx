import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

interface Producto {
  id: number;
  nombreProducto: string;
  descripcionProducto: string;
}

export default function ProductoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setError("No hay token de acceso disponible.");
          return;
        }

        const response = await axios.post(
          "http://localhost:6061/api/v1/consultar-producto-id",
          { id: Number(id) },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.respuesta.esExitosa) {
          setProducto(response.data.resultado);
        } else {
          throw new Error("Error al obtener el producto.");
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.respuesta?.mensaje || "Error en la autenticación");
        } else {
          setError("Error desconocido al obtener el producto.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProducto();
    }
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!producto || !producto.id) {
      setError("El producto no tiene un ID válido.");
      return;
    }
  
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("No hay token de acceso disponible.");
        return;
      }
  
      const response = await axios.post(
        "http://localhost:6061/api/v1/actualizar-producto",
        {
          id: producto.id,
          nombreProducto: producto.nombreProducto,
          descripcionProducto: producto.descripcionProducto,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      // Validar la estructura del response basado en lo que envía el backend
      if (response.data?.esExitosa) {
        navigate("/producto");
      } else {
        throw new Error(response.data?.mensaje || "Error al actualizar el producto.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.mensaje || "Error en la actualización.");
      } else {
        setError("Error desconocido al actualizar el producto.");
      }
    }
  };
  
  
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
          Editar Producto
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium">Nombre del Producto <span className="text-error-500">*</span></label>
              <input
                type="text"
                className="border p-2 w-full rounded-md"
                placeholder="Nombre del Producto"
                value={producto?.nombreProducto || ""}
                onChange={(e) => setProducto({ ...producto!, nombreProducto: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Descripción <span className="text-error-500">*</span></label>
              <textarea
                className="border p-2 w-full rounded-md"
                placeholder="Descripción del Producto"
                value={producto?.descripcionProducto || ""}
                onChange={(e) => setProducto({ ...producto!, descripcionProducto: e.target.value })}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div>
              <button 
                type="submit" 
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-md"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-5 text-center">
          <button 
            onClick={() => navigate("/producto")} 
            className="text-sm text-gray-700 dark:text-gray-400 hover:text-brand-500"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
