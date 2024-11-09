import React, { useEffect, useState } from "react";
import { useUser } from "../hooks/UserContext";
import { useAccountManagement } from '../hooks/useAccountManagement'; 

import { Header } from "../Header.jsx";
import { Detalle_facturas } from "./Detalle_facturas.jsx";
import { Footer } from "../Footer.jsx";
import "../../index.css";
import { Sidebar } from '../Sidebar.jsx';

export function Punto_venta() {
  const { user } = useUser(); // Obtener el usuario logueado
  const { logout } = useAccountManagement(); // Usa el hook para obtener la función logout
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [carrito, setCarrito] = useState([]);

  // Calcular el precio unitario promedio
  const totalPreciosUnitarios = carrito.reduce((acc, item) => acc + item.precio_consumidor, 0);
  const precioUnitarioPromedio = totalPreciosUnitarios / (carrito.length || 1); // Asegúrate de evitar división por cero

  useEffect(() => {
    // Función para obtener clientes filtrados por empresa_id
    const fetchClientes = async () => {
      try {
        const response = await fetch("http://localhost/managersyncbdf/public/api/clientes/all");
        const data = await response.json();
        const clientesFiltrados = data.filter(cliente => cliente.empresa_id === user.empresa_id);
        setClientes(clientesFiltrados);
      } catch (error) {
        console.error("Error al obtener clientes:", error);
      }
    };

    // Función para obtener productos
    const fetchProductos = async () => {
      try {
        const response = await fetch("http://localhost/managersyncbdf/public/api/productos/all");
        const data = await response.json();
        const productosFiltrados = data.filter(producto => producto.empresa_id === user.empresa_id);
        setProductos(productosFiltrados);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchClientes();
    fetchProductos();
  }, [user.empresa_id]); // Reemplaza el efecto cuando el empresa_id del usuario cambie

  const handleAgregarProducto = () => {
    if (selectedProducto) {
      const total = selectedProducto.precio_consumidor * cantidad;
  
      setCarrito(prevCarrito => {
        // Buscar si el producto ya está en el carrito
        const productoExistente = prevCarrito.find(item => item.id === selectedProducto.id);
        
        if (productoExistente) {
          // Si el producto ya está en el carrito, incrementa la cantidad y el total
          return prevCarrito.map(item =>
            item.id === selectedProducto.id
              ? { 
                  ...item, 
                  cantidad: item.cantidad + cantidad, 
                  total: item.total + total 
                }
              : item
          );
        } else {
          // Si el producto no está en el carrito, agregarlo como nuevo
          return [...prevCarrito, { 
            ...selectedProducto, 
            cantidad, 
            total 
          }];
        }
      });
  
      // Restablecer cantidad y producto seleccionado después de agregar al carrito
      setCantidad(1);
      setSelectedProducto(null);
    }
  };
  

  const handleReiniciarVenta = () => {
    setSelectedCliente(null); // Reiniciar cliente seleccionado
    setSelectedProducto(null); // Reiniciar producto seleccionado
    setCantidad(1); // Reiniciar cantidad
    setCarrito([]); // Vaciar carrito
  };

  const subtotal = carrito.reduce((acc, item) => acc + item.total, 0);
  const totalIVA = subtotal * 0.13;
  const totalVenta = subtotal + totalIVA;

  return (
    <>
      <Header />

      <div className="bg-slate-300 w-screen h-max flex">
        <div className="basis-1/4 lg:mr-11 -mr-16 h-full">
          <Sidebar logout={logout} /> 
        </div>
        <div className="pt-2 ps-3 flex lg:flex-row flex-col overflow-x-hidden">
          <div className="lg:basis-3/4 lg:h-min lg:w-full w-80 lg:py-2 lg:pt-12 lg:p-6 lg:mx-auto lg:pb-8 mt-6 lg:ml-3 lg:mb-4 bg-white rounded-lg shadow-lg">
            <div className="lg:grid lg:grid-cols-6">
              {/* Botón para reiniciar la venta */}
              <button
                onClick={handleReiniciarVenta}
                className="lg:-mt-4 mt-3 ml-3 lg:mr-0 mr-4 lg:px-3 py-2 text-white bg-sky-900 rounded-xl hover:bg-indigo-900 lg:w-full w-11/12">
                Nueva Venta
              </button>
            </div>
            <div className="lg:grid lg:grid-cols-2 gap-4 p-3">
            <select
  className="w-full p-2 border b-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
  onChange={(e) => setSelectedCliente(clientes.find(cliente => cliente.id === parseInt(e.target.value)))}
  value={selectedCliente ? selectedCliente.id : ""}
>
  <option value="">Seleccionar cliente...</option>
  {clientes.map((cliente) => (
    <option key={cliente.id} value={cliente.id}>
      {cliente.nombre}
    </option>
  ))}
</select>
              <div>
                <div className="flex space-x-2">
                <button
                  className="px-4 py-2 text-sm font-medium rounded-2xl bg-gray-100 text-gray-600 hover:bg-slate-200 hover:text-sky-800 transition duration-200"
                  onClick={() => { window.location.href = '/MantenimientoClientes'; }}>
                  Crear/Editar Cliente
                </button>

                
                  <button className="px-4 py-2 text-sm font-medium rounded-2xl p-2 bg-gray-100 text-gray-600 hover:bg-slate-200 hover:text-sky-800 transition duration-200">
                    Crear Exoneración
                  </button>
                </div>
              </div>
            </div>

            <ul className="flex flex-wrap pb-3 text-sm font-medium text-center text-gray-500 border-b border-gray-200">
              <li className="me-2">
                <a
                  href="#"
                  aria-current="page"
                  className="inline-block p-4  active:text-blue-900 active:bg-gray-100 hover:text-gray-600 hover:bg-gray-50 rounded-t-lg active">
                  Contado
                </a>
              </li>
              <li className="me-2">
                <a
                  href="#"
                  className="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">
                  Crédito
                </a>
              </li>
              <li className="me-2">
                <a
                  href="#"
                  className="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">
                  Proforma
                </a>
              </li>
            </ul>

            <div className="grid grid-cols-6 p-2 gap-1">
              <div className="col-span-1">
                <input
                  type="number"
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                  className="lg:w-full w-10 p-2 border mb-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                  placeholder="Cantidad"
                />
              </div>
              <div className="col-span-2">
                <select
                  className="w-full p-2 border rounded mb-4 lg:ml-0 -ml-1"
                  onChange={(e) => setSelectedProducto(JSON.parse(e.target.value))}
                  value={selectedProducto ? JSON.stringify(selectedProducto) : ""}
                >
                  <option value="">Seleccionar producto...</option>
                  {productos.map((producto) => (
                    <option key={producto.id} value={JSON.stringify(producto)}>
                      {producto.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <input
                  type="text"
                  readOnly
                  value={selectedProducto ? `₡${selectedProducto.precio_consumidor}` : ""}
                  className="lg:w-full lg:ml-0 -ml-1 w-20 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700 mb-4"
                  placeholder="Precio"
                />
              </div>
              <div className="col-span-1">
                <button
                  onClick={handleAgregarProducto}
                  className="lg:px-4 px-2 py-2 lg:ml-0 ml-7 text-white bg-sky-900 rounded-xl hover:bg-indigo-900">
                  Agregar
                </button>
              </div>
            </div>

            <div className="relative overflow-x-auto shadow-md rounded-lg">
              <table className="min-w-full bg-white shadow-md rounded-lg lg:ml-0 ml-5 lg:mr-0 mr-3 lg:mb-0 mb-7 overflow-hidden">
                <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <tr>
                    <th className="p-3 text-left">Cantidad</th>
                    <th className="p-3 text-left">Código</th>
                    <th className="p-3 text-left">Descripción</th>
                    <th className="p-3 text-left">I.V.A</th>
                    <th className="p-3 text-left">Precio</th>
                    <th className="p-3 text-left">Total</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
  {carrito.map((item, index) => (
    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition">
      <td className="p-3">{item.cantidad}</td>
      <td className="p-3">{item.codigo_cabys}</td>
      <td className="p-3">{item.descripcion}</td>
      <td className="p-3">{(item.total * 0.13).toFixed(2)}</td>
      <td className="p-3">{`₡${item.precio_consumidor}`}</td>
      <td className="p-3">{`₡${item.total}`}</td>
    </tr>
  ))}
</tbody>

              </table>
            </div>
          </div>
        

        <div className="lg:pt-2 lg:pr-12 lg:ml-4 mr-5">
          <Detalle_facturas 
            subtotal={subtotal}
            totalIVA={totalIVA}
            totalVenta={totalVenta}
            carrito={carrito}
            selectedCliente={selectedCliente}
            user={user} // Pasar el usuario logueado a Detalle_facturas
            precioUnitario={precioUnitarioPromedio} 
          />
        </div></div>
      </div>
      <Footer />
    </>
  );
}
