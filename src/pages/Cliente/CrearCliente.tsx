import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";

interface Cliente {
  numeroIdentificacion: string;
  razonSocial: string;
  descripcion: string;
  tipoImpuesto: number;
}

const CrearCliente = () => {
  const [cliente, setCliente] = useState<Cliente>({
    numeroIdentificacion: "",
    razonSocial: "",
    descripcion: "",
    tipoImpuesto: 1, // Valor por defecto 1
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCliente((prev) => ({
      ...prev,
      [name]: name === "tipoImpuesto" ? Number(value) : value, // Convertir el tipoImpuesto a número
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
        "http://localhost:6061/api/v1/crear-cliente", // Endpoint para crear un cliente
        cliente,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.esExitosa) {
        navigate("/cliente"); // Redirige a la lista de clientes después de crear
      } else {
        throw new Error("Error al crear el cliente.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.mensaje || "Error al crear el cliente.");
      } else {
        setError("Error desconocido al crear el cliente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
      <div>
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
          Crear Cliente
        </h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <Label>Número de Identificación</Label>
            <Input
              type="text"
              name="numeroIdentificacion"
              value={cliente.numeroIdentificacion}
              onChange={handleChange}
              placeholder="Número de Identificación"
            />
          </div>
          <div>
            <Label>Razón Social</Label>
            <Input
              type="text"
              name="razonSocial"
              value={cliente.razonSocial}
              onChange={handleChange}
              placeholder="Razón Social"
            />
          </div>
          <div>
            <Label>Descripción</Label>
            <Input
              type="text"
              name="descripcion"
              value={cliente.descripcion}
              onChange={handleChange}
              placeholder="Descripción"
            />
          </div>
          <div>
            <Label>Tipo de Impuesto</Label>
            <select
              name="tipoImpuesto"
              value={cliente.tipoImpuesto}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value={0}>0</option>
              <option value={1}>1</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <Button className="w-full" size="sm" disabled={loading}>
              {loading ? "Creando..." : "Crear Cliente"}
            </Button>
          </div>
        </div>
      </form>
      <div className="mt-5">
        <button
          onClick={() => navigate("/cliente")}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default CrearCliente;
