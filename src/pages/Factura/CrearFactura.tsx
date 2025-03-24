import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

interface Producto {
  id: number;
  nombreProducto: string;
  descripcionProducto: string;
}

interface Cliente {
  id: number;
  numeroIdentificacion: string;
  razonSocial: string;
}

interface Factura {
  idCliente: number;
  fechaFactura: string;
  glosa: string;
  detalles: { idProducto: number; cantidad: number }[];
}

const CrearFactura = () => {
  const [factura, setFactura] = useState<Factura>({
    idCliente: 7, // ID del cliente puede ser dinámico
    fechaFactura: new Date().toISOString(),
    glosa: "",
    detalles: [],
  });
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setError("No hay token de acceso disponible.");
          return;
        }
        const response = await axios.post(
          "http://localhost:6061/api/v1/consultar-clientes",
          { numeroIdentificacion: "", nombreContiene: "" },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.respuesta?.esExitosa && Array.isArray(response.data.resultados)) {
          setClientes(response.data.resultados);
        } else {
          throw new Error(response.data.respuesta?.mensaje || "Error al obtener clientes.");
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.respuesta?.mensaje || "Error en la API.");
        } else {
          setError("Error desconocido al obtener clientes.");
        }
      }
    };

    fetchClientes();
  }, []);

  useEffect(() => {
    
    const fetchProductos = async () => {
      try {
        setLoading(true); // Indicar que está cargando
        setError(null); // Resetear errores previos
    
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setError("No hay token de acceso disponible.");
          return;
        }
    
        const response = await axios.post(
          "http://localhost:6061/api/v1/consultar-productos",
          {}, // Si la API requiere un cuerpo vacío, lo enviamos así
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
    
        if (response.data.respuesta?.esExitosa && Array.isArray(response.data.resultados)) {
          setProductos(response.data.resultados);
        } else {
          throw new Error(response.data.respuesta?.mensaje || "Error al obtener productos.");
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.respuesta?.mensaje || "Error en la API.");
        } else {
          setError("Error desconocido al obtener productos.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFactura((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDetallesChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    const newDetalles = [...factura.detalles];
  
    newDetalles[index] = {
      ...newDetalles[index],
      [name]: name === "idProducto" ? Number(value) : value, // Convertir a número si es idProducto
    };
  
    setFactura((prev) => ({
      ...prev,
      detalles: newDetalles,
    }));
  };
  

  const handleAddDetalle = () => {
    setFactura((prev) => ({
      ...prev,
      detalles: [...prev.detalles, { idProducto: 0, cantidad: 1 }],
    }));
  };

  const handleRemoveDetalle = (index: number) => {
    const newDetalles = [...factura.detalles];
    newDetalles.splice(index, 1);
    setFactura((prev) => ({
      ...prev,
      detalles: newDetalles,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("No hay token de acceso disponible.");
        return;
      }

      const response = await axios.post(
        "http://localhost:6061/api/v1/crear-factura",
        factura,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.esExitosa) {
        navigate("/factura"); // Redirige a la lista de facturas después de crear
      } else {
        throw new Error("Error al crear la factura.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.mensaje || "Error al crear la factura.");
      } else {
        setError("Error desconocido al crear la factura.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageMeta title="CITIKOLD" description="" />
      <PageBreadcrumb pageTitle="Crear Factura" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Crear Factura
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
            <div>
                <Label>Cliente</Label>
                <select
                  name="idCliente"
                  value={factura.idCliente}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Seleccionar Cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.razonSocial} - {cliente.numeroIdentificacion}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Glosa</Label>
                <Input
                  type="text"
                  name="glosa"
                  value={factura.glosa}
                  onChange={handleChange}
                  placeholder="Descripción de la factura"
                />
              </div>

              <div>
                <Label>Fecha de la Factura</Label>
                <Input
                  type="datetime-local"
                  name="fechaFactura"
                  value={factura.fechaFactura}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Detalles de la Factura</Label>
                {factura.detalles.map((detalle, index) => (
                  <div key={index} className="flex space-x-4">
                    <select
                      name="idProducto"
                      value={detalle.idProducto}
                      onChange={(e) => handleDetallesChange(e, index)}
                      className="w-1/2"
                    >
                      <option value={0}>Seleccionar Producto</option>
                      {productos.map((producto) => (
                        <option key={producto.id} value={producto.id}>
                          {producto.nombreProducto} - {producto.descripcionProducto}
                        </option>
                      ))}
                    </select>
                    <Input
                      type="number"
                      name="cantidad"
                      value={detalle.cantidad}
                      onChange={(e) => handleDetallesChange(e, index)}
                      className="w-1/4"
                      placeholder="Cantidad"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveDetalle(index)}
                      className="text-red-500"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddDetalle}
                  className="text-blue-500"
                >
                  Añadir Detalle
                </button>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div>
                <Button className="w-full" size="sm" disabled={loading}>
                  {loading ? "Creando..." : "Crear Factura"}
                </Button>
              </div>
            </div>
          </form>
          <div className="mt-5">
            <button
              onClick={() => navigate("/factura")}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearFactura;
