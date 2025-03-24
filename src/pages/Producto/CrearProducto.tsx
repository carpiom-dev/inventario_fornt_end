import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";

interface Producto {
  id?: number;
  nombreProducto: string;
  descripcionProducto: string;
}

const CrearProducto = () => {
  const [producto, setProducto] = useState<Producto>({
    nombreProducto: "",
    descripcionProducto: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProducto((prev) => ({ ...prev, [name]: value }));
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
        "http://localhost:6061/api/v1/crear-producto", // Usamos el endpoint para crear el producto
        producto,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.esExitosa) {
        navigate("/producto"); // Redirige a la lista de productos después de crear
      } else {
        throw new Error("Error al crear el producto.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.mensaje || "Error al crear el producto.");
      } else {
        setError("Error desconocido al crear el producto.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
      <div>
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
          Crear Producto
        </h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <Label>Nombre del Producto</Label>
            <Input
              type="text"
              name="nombreProducto"
              value={producto.nombreProducto}
              onChange={handleChange}
              placeholder="Nombre del Producto"
            />
          </div>
          <div>
            <Label>Descripción del Producto</Label>
            <Input
              type="text"
              name="descripcionProducto"
              value={producto.descripcionProducto}
              onChange={handleChange}
              placeholder="Descripción del Producto"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <Button className="w-full" size="sm" disabled={loading}>
              {loading ? "Creando..." : "Crear Producto"}
            </Button>
          </div>
        </div>
      </form>
      <div className="mt-5">
        <button
          onClick={() => navigate("/producto")}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default CrearProducto;
