import { useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import PageMeta from "../../components/common/PageMeta";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";

interface ApiResponse {
  respuesta: {
    codigo: string;
    mensaje: string;
    esExitosa: boolean;
    existeExcepcion: boolean;
  };
  resultados: {
    id: number;
    nombreProducto: string;
    descripcionProducto: string;
    fechaCreacion: string;
    fechaModificacion: string | null;
  }[];
}

export default function ProductoPage() {
  const [productos, setProductos] = useState<ApiResponse["resultados"]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();


  useEffect(() => {
    const controller = new AbortController();

    const fetchProductos = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setError("No hay token de acceso disponible.");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:6061/api/v1/consultar-productos", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({}),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudieron obtener los productos.`);
        }

        const data: ApiResponse = await response.json();
        if (data.respuesta.esExitosa) {
          setProductos(data.resultados);
        } else {
          throw new Error("La respuesta del servidor indica un error.");
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.respuesta?.mensaje || "Error en la autenticación");
        } else {
          setError("Error desconocido al iniciar sesión");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();

    return () => {
      controller.abort();
    };
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("No hay token de acceso disponible.");
        return;
      }
  
      // Enviamos la solicitud con el id en el cuerpo de la petición
      const response = await axios.post(
        "http://localhost:6061/api/v1/eliminar-producto",
        { id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data.esExitosa) {
        setProductos((prevProductos) => prevProductos.filter((producto) => producto.id !== id));
      } else {
        setError("Error al eliminar el producto.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.mensaje || "Error en la eliminación.");
      } else {
        setError("Error desconocido al eliminar el producto.");
      }
    }
  };

  return (
    <div>
      <PageMeta title="CITIKOLD" description="" />
      <PageBreadcrumb pageTitle="Productos" />
      <div className="space-y-6">
        <ComponentCard title="Producto">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
            <div className="flex justify-end mt-4">
            <button
                onClick={() => navigate("/productoCrear")} // Redirige a /productoCrear
                className="px-4 py-2 text-white bg-green-500 hover:bg-green-700 rounded-lg"
              >
                Guardar
              </button>
            </div>
              <div className="min-w-[600px]">
                {loading ? (
                  <p className="p-4 text-gray-500">Cargando productos...</p>
                ) : error ? (
                  <p className="p-4 text-red-500">{error}</p>
                ) : (
                  <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                      <TableRow>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                          ID
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                          Nombre
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                          Descripción
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                          Fecha Creación
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                          Acciones
                        </TableCell>
                      </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {productos.map((producto) => (
                        <TableRow key={producto.id}>
                          <TableCell className="px-5 py-4 text-gray-800">{producto.id}</TableCell>
                          <TableCell className="px-5 py-4 text-gray-800">{producto.nombreProducto}</TableCell>
                          <TableCell className="px-5 py-4 text-gray-500">{producto.descripcionProducto}</TableCell>
                          <TableCell className="px-5 py-4 text-gray-500">
                            {new Date(producto.fechaCreacion).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-gray-500">
                          <button
                            onClick={() => navigate(`/producto/${producto.id}`)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Editar
                          </button>
                            <button
                              onClick={() => handleDelete(producto.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Eliminar
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
