import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Producto from "./pages/Producto/Producto";
import ProductoForm from "./pages/Producto/ProductoForm";
import CrearProducto from "./pages/Producto/CrearProducto";
import CrearCliente from "./pages/Cliente/CrearCliente";

import Cliente from "./pages/Cliente/Cliente";
import EditarCliente from "./pages/Cliente/EditarCliente";
import Stock from "./pages/Inventario/Stock";
import Kardex from "./pages/Inventario/Kardex";
import Factura from "./pages/Factura/Factura";
import CrearFactura from "./pages/Factura/CrearFactura";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/home" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />
            <Route path="/producto" element={<Producto />} />
            <Route path="/producto/:id" element={<ProductoForm />} />
            <Route path="/productoCrear" element={<CrearProducto />} />
            <Route path="/cliente" element={<Cliente />} />
            <Route path="/cliente/:id" element={<EditarCliente />} />
            <Route path="/clienteCrear" element={<CrearCliente />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/kardex" element={<Kardex />} />
            <Route path="/factura" element={<Factura />} />
            <Route path="/facturaCrear" element={<CrearFactura />} />
            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
