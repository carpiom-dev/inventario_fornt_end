import { useState, useEffect } from "react";
import axios from "axios";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { Table } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import { useNavigate } from "react-router-dom";

interface DetalleFactura {
  idProducto: number;
  nombreProducto?: string;
  cantidad: number;
  precio?: number;
  subtotal?: number;
  descuento?: number;
  impuesto?: number;
  total?: number;
}

interface Factura {
  id: number;
  idCliente: number;
  nombreCliente: string;
  fechaFactura: string;
  glosa: string;
  subtotal: number;
  descuento: number;
  impuesto: number;
  total: number;
  estado: string;
  detalles?: DetalleFactura[];
}

const FacturasPage = () => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [factura, setFactura] = useState<Factura | null>(null);
  const [idFactura, setIdFactura] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    obtenerFacturas();
  }, []);

  const obtenerFacturas = async () => {
    try {
      const response = await axios.post("http://localhost:6061/api/v1/consultar-facturas");
      setFacturas(response.data.resultados);
    } catch (error) {
      console.error("Error al obtener facturas", error);
    }
  };

  const consultarFactura = async () => {
    try {
      const response = await axios.post("http://localhost:6061/api/v1/consultar-factura-id", { id: idFactura });
      setFactura(response.data.resultado);
    } catch (error) {
      console.error("Error al consultar factura", error);
    }
  };

  const eliminarFactura = async (id: number) => {
    try {
      await axios.post("http://localhost:6061/api/v1/eliminar-factura", { id });
      obtenerFacturas();
    } catch (error) {
      console.error("Error al eliminar factura", error);
    }
  };

  return (
    <div>
      <PageMeta title="CITIKOLD" description="" />
      <PageBreadcrumb pageTitle="Facturación" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center">
        <div className="flex justify-end mt-4">
            <button
                onClick={() => navigate("/facturaCrear")} // Redirige a /productoCrear
                className="px-4 py-2 text-white bg-green-500 hover:bg-green-700 rounded-lg"
              >
                Crear Factura
              </button>
            </div>
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Gestión de Facturas
          </h3>
          
          <div className="my-4">
            <Input value={idFactura} onChange={(e) => setIdFactura(e.target.value)} placeholder="ID Factura" />
            <Button onClick={consultarFactura} className="ml-2">Consultar Factura</Button>
          </div>
          
          {factura && (
            <div className="border p-2">
              <h2>Factura #{factura.id}</h2>
              <p>Cliente: {factura.nombreCliente}</p>
              <p>Total: {factura.total}</p>
              <h3 className="mt-2 font-semibold">Detalles:</h3>
              <Table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                    <th>Impuesto</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {factura.detalles?.map((detalle) => (
                    <tr key={detalle.idProducto}>
                      <td>{detalle.nombreProducto}</td>
                      <td>{detalle.cantidad}</td>
                      <td>{detalle.precio}</td>
                      <td>{detalle.subtotal}</td>
                      <td>{detalle.impuesto}</td>
                      <td>{detalle.total}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
          
          <h2 className="mt-4 text-lg">Listado de Facturas</h2>
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((factura) => (
                <tr key={factura.id}>
                  <td>{factura.id}</td>
                  <td>{factura.nombreCliente}</td>
                  <td>{factura.total}</td>
                  <td>    
                    <Badge variant="light" color={factura.estado === 'Eliminada' ? 'error' : 'success'}>
                        {factura.estado}
                    </Badge>
                  </td>
                  <td>
                <button
                    onClick={() => eliminarFactura(factura.id)}
                    className="text-red-500 hover:text-red-700"
                >
                    Eliminar
                </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default FacturasPage;
