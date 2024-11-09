import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useUser } from "../hooks/UserContext";
import { PDFViewer, PDFDownloadLink, Document, Page, Text, pdf } from '@react-pdf/renderer';

export function Factura({ subtotal, totalIVA, totalVenta, carrito, selectedCliente, onClose }) {
  const { user } = useUser();
  
  const [tipoFactura, setTipoFactura] = useState('venta');
  const [fechaEmision, setFechaEmision] = useState(new Date().toISOString().split('T')[0]);
  const [fechaVencimiento, setFechaVencimiento] = useState(new Date().toISOString().split('T')[0]);
  const [estado, setEstado] = useState('Emitida');
  const [descripciones, setDescripciones] = useState({});
  const [facturaId, setFacturaId] = useState(null);
  const [codigoUnico, setCodigoUnico] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);

  // Nueva lógica de pago
  const [empresa, setEmpresa] = useState({
    nombre: '',
    direccion: '',
    telefono: ''
  });
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [cantidadPagada, setCantidadPagada] = useState(0);
  const [vuelto, setVuelto] = useState(0);
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [nombreTitular, setNombreTitular] = useState('');

  useEffect(() => {
    if (user?.empresa_id) {
      fetch(`http://localhost/managersyncbdf/public/api/empresas/${user.empresa_id}`)
        .then(response => response.json())
        .then(data => {
          setEmpresa({
            nombre: data.nombre || 'Nombre no disponible',
            otras_senas: data.otras_senas || 'Dirección no disponible',
            telefono: data.telefono || 'Teléfono no disponible',
              cedula_empresa: data.cedula_empresa || 'Teléfono no disponible'
          });
        })
        .catch(error => console.error("Error al obtener datos de la empresa:", error));
    }
  }, [user]);

  useEffect(() => {
    console.log('selectedCliente:', selectedCliente);
  }, [selectedCliente]);

  const handleDescriptionChange = (index, value) => {
    setDescripciones(prev => ({
      ...prev,
      [index]: value
    }));
  };

  // Componente para generar el PDF
  const FacturaPDF = () => (
    <Document>
      <Page style={{ padding: 20 }}>
        <Text style={{ marginBottom: 5 }}>Empresa: {empresa.nombre}</Text>
        <Text style={{ marginBottom: 5 }}>Sucursal</Text>
        <Text style={{ marginBottom: 5 }}>Dirección: {empresa.otras_senas}</Text>
        <Text style={{ marginBottom: 5 }}>Teléfono: {empresa.telefono}</Text>
        <Text style={{ marginBottom: 5 }}>Cédula: {empresa.cedula_empresa}</Text>
        <Text style={{ marginBottom: 5 }}>Usuario: José Fabio Ramirez</Text>
        <Text style={{ marginBottom: 5 }}>-------------------------------------------</Text>
        <Text style={{ marginBottom: 5 }}>Factura Electrónica #{facturaId}</Text>
        <Text style={{ marginBottom: 5 }}>Código Único: {codigoUnico}</Text>
        <Text style={{ marginBottom: 5 }}>Cliente: {selectedCliente?.nombre || 'Cliente no especificado'}</Text>
        <Text style={{ marginBottom: 5 }}>Correo: {selectedCliente?.email || selectedCliente?.correo || 'Correo no especificado'}</Text>
        <Text style={{ marginBottom: 5 }}>Fecha de emisión: {fechaEmision}</Text>
        <Text style={{ marginBottom: 5 }}>Fecha de vencimiento: {fechaVencimiento}</Text>
        <Text style={{ marginBottom: 5 }}>Estado: {estado}</Text>
        <Text style={{ marginBottom: 5 }}>-------------------------------------------</Text>
  
        <Text style={{ marginBottom: 5 }}>Detalles de la factura:</Text>
        {carrito.map((item, index) => (
          <Text key={index} style={{ marginBottom: 5 }}>
            Código cabys de producto: {item.codigo_cabys}, {item.descripcion} - Cantidad: {item.cantidad}, Precio Unitario: ₡{item.precio_consumidor}, Total: ₡{(item.cantidad * item.precio_consumidor).toFixed(2)}
          </Text>
        ))}
  
        <Text style={{ marginBottom: 5 }}>-------------------------------------------</Text>
        <Text style={{ marginBottom: 5 }}>Subtotal: ₡{subtotal.toFixed(2)}</Text>
        <Text style={{ marginBottom: 5 }}>IVA: ₡{totalIVA.toFixed(2)}</Text>
        <Text style={{ marginBottom: 5 }}>Total Venta: ₡{totalVenta.toFixed(2)}</Text>
        <Text style={{ marginBottom: 5 }}>Cambio: {vuelto}</Text>
  
        <Text style={{ marginBottom: 5 }}>Autorizada mediante resolución No.DGT-R-48-2016 DEL 07/10/2016</Text>
        <Text style={{ marginBottom: 5 }}>Orden 00000-000-0000</Text>
        <Text style={{ marginBottom: 5 }}>{fechaEmision}</Text>
        <Text style={{ marginBottom: 5 }}>Autorizada mediante resolución No.DGT-R-0033-2019 DEL 07/10/2019</Text>
        <Text style={{ marginBottom: 5 }}>Versión del documento 4.3</Text>
      </Page>
    </Document>
  );
  
  

const calcularVuelto = (montoPagado) => {
  const cambio = montoPagado - totalVenta;
  setVuelto(cambio >= 0 ? cambio : 0);
};
const detallesFactura = carrito.map((item) => ({
  codigo_cabys: item.codigo_cabys,  // Código CABYS del producto
  cantidad: item.cantidad,          // Cantidad del producto
  descripcion: item.descripcion,    // Descripción del producto
  precio_unitario: item.precio_consumidor,
  total: item.cantidad * item.precio_consumidor, // Total por item
  subtotal: subtotal,               // Subtotal (recibido por parámetro)
  totalIVA: totalIVA,               // Total IVA (recibido por parámetro)
  totalVenta: totalVenta,           // Total de la venta (recibido por parámetro)
}));


  const handleFacturar = async () => {
    if (!selectedCliente || !user || (metodoPago === 'efectivo' && cantidadPagada < totalVenta)) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }

    const facturaData = {
      empresa_id: user?.empresa_id || '',
      cliente_id: selectedCliente.id,
      usuario_id: user.id,
      fecha_emision: fechaEmision,
      fecha_vencimiento: fechaVencimiento,
      total: totalVenta,
      tipo: tipoFactura,
      estado: estado,
      detalles: detallesFactura, // Incluye los detalles directamente aquí

      
    };

    try {
      const response = await fetch("http://localhost/managersyncbdf/public/api/facturas", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(facturaData),
      });

      if (response.ok) {
        const result = await response.json();
        setFacturaId(result.id);
        setCodigoUnico(result.codigo_unico);
        alert("Factura registrada exitosamente.");
        await handleGuardarDetalle(result.id);
        setShowModal(true);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.errors ? JSON.stringify(errorData.errors) : 'Error desconocido'}`);
      }
    } catch (error) {
      alert('Error en la solicitud. Inténtalo nuevamente.');
      console.error("Error en la solicitud:", error);
    }
  };
 
  const handleGuardarDetalle = async (facturaIdParam) => {
    const detalles = carrito.map((item) => {
      const cantidad = item.cantidad || 0;
      const precioUnitario = item.precio_consumidor || 0;

      if (cantidad <= 0) {
        alert(`La cantidad del producto ${item.descripcion} debe ser mayor a cero.`);
        return null;
      }

      if (precioUnitario <= 0) {
        alert(`El precio unitario del producto ${item.descripcion} debe ser mayor a cero.`);
        return null;
      }

      return {
        factura_id: facturaIdParam,
        producto_id: item.id,
        codigo_cabys: item.codigo_cabys,
        cantidad: cantidad,
        precio_unitario: precioUnitario,
        total: cantidad * precioUnitario,
        descripcion: item.descripcion || ''
      };
    }).filter(item => item !== null);

    if (detalles.length === 0) {
      alert("No hay detalles válidos para guardar.");
      return;
    }

    for (const detalle of detalles) {
      try {
        const response = await fetch("http://localhost/managersyncbdf/public/api/detalles-factura", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(detalle),
        });

        if (response.ok) {
          await actualizarStockProducto(detalle.producto_id, detalle.cantidad);
        } else {
          const errorData = await response.json();
          alert(`Error guardando detalle: ${errorData.errors ? JSON.stringify(errorData.errors) : 'Error desconocido'}`);
        }
      } catch (error) {
        alert('Error en la solicitud para guardar detalle. Inténtalo nuevamente.');
        console.error("Error al guardar detalle:", error);
      }
    }

    alert("Detalles guardados exitosamente.");
  };

  const actualizarStockProducto = async (productoId, cantidadVendida) => {
    try {
      const response = await fetch(`http://localhost/managersyncbdf/public/api/productos/${productoId}/reducir-stock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad: cantidadVendida }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error actualizando stock: ${errorData.errors ? JSON.stringify(errorData.errors) : 'Error desconocido'}`);
      }
    } catch (error) {
      alert('Error al actualizar el stock. Inténtalo nuevamente.');
      console.error("Error al actualizar stock:", error);
    }
  };

  return (
    <div className="overflow-x-hidden lg:items-center lg:flex lg:flex-col lg:fixed lg:mb-0 mb-24 lg:top-16 lg:ml-0 ml-5 lg:mr-0 mr-5 lg:mt-0 mt-12 lg:pl-0 pl-6 lg:pr-0 pr-6  lg:right-80 lg:left-72 lg:w-auto lg:h-auto w-11/12 h-full ">
      <div className=" p-6 bg-white rounded-lg shadow-lg">
        <h1 className="lg:text-4xl text-2xl font-bold text-gray-800 mb-10 mt-5 text-center">Registrar Factura</h1>

<div className="overflow-y-scroll scroll-mx-1 p-5 h-96">
        {/* Formulario de datos de la factura */}
        <div className="mb-4 flex justify-between">
          <label>Tipo:</label>
          <select
            className="border p-1 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
            value={tipoFactura}
            onChange={(e) => setTipoFactura(e.target.value)}
            required>
            <option value="venta">Venta</option>
            <option value="compra">Compra</option>
          </select>
        </div>
        <div className="mb-4 flex justify-between">
          <label>Fecha Emisión:</label>
          <input
            type="date"
            className="border p-1 rounded-md shadow-sm w-3/6 focus:outline-none focus:ring-2 focus:ring-sky-700"
            value={fechaEmision}
            onChange={(e) => setFechaEmision(e.target.value)}
            required
          />
        </div>
        <div className="mb-4 flex justify-between">
          <label>Fecha Vencimiento:</label>
          <input
            type="date"
            className="border p-1 rounded-md shadow-sm w-3/6 focus:outline-none focus:ring-2 focus:ring-sky-700"
            value={fechaVencimiento}
            onChange={(e) => setFechaVencimiento(e.target.value)}
            required
          />
        </div>
        <div className="mb-6 flex justify-between">
          <label>Estado:</label>
          <select
            className="border p-1 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700 "
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            required>
            <option value="Emitida">Emitida</option>
            <option value="Pagada">Pagada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>
        <div className="mb-4 flex justify-between  px-4 py-4 rounded-md">
          <label className='font-bold text-lg'>Total:</label>
          <input
            type="text"
            className=" p-1 rounded w-32 text-right font-bold text-lg"
            value={`₡${totalVenta.toFixed(2)}`}
            readOnly
          />
        </div>

        {/* Sección de pago */}
        <div className="mb-4 flex justify-between">
          <label>Método de Pago:</label>
          <select
            className="border p-1 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
            value={metodoPago}
            onChange={(e) => {
              setMetodoPago(e.target.value);
              setCantidadPagada(0); // Reiniciar monto pagado al cambiar método
            }}
          >
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
          </select>
        </div>
        {metodoPago === 'efectivo' ? (
          <div className="lg:mb-4 flex justify-between lg:flex-row flex-col">
            <label>Cantidad Pagada: </label>
            <input
              type="number"
              className="border p-1 lg:mb-0 mb-3 lg:mt-0 mt-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700 lg:w-4/12 w-11/12"
              value={cantidadPagada}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setCantidadPagada(value);
                calcularVuelto(value);
              }}
              required
            />
            <span className="lg:ml-2">Vuelto: ₡{vuelto.toFixed(2)}</span>
          </div>
        ) : (
          <div className='flex flex-col'>
            <div className="mb-4 lg:flex lg:justify-between">
              <label>Número de Tarjeta:</label>
              <input
                type="text"
                className="border p-1 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700 w-3/6 lg:"
                value={numeroTarjeta}
                onChange={(e) => setNumeroTarjeta(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 lg:flex justify-between">
              <label>Nombre del Titular:</label>
              <input
                type="text"
                className="border p-1 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700 w-3/6"
                value={nombreTitular}
                onChange={(e) => setNombreTitular(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* Mostrar y editar las descripciones del carrito */}
        <div className="mt-16 flex flex-col">
        {carrito.map((item, index) => (
          <div key={item.id} className="lg:flex justify-between items-center lg:mb-4 mb-6 overscroll-y-contain">
            <span className="text-gray-700">{item.descripcion}</span>
            <input
              type="text"
              className="rounded-md shadow-sm w-2/6 focus:outline-none focus:ring-2 focus:ring-sky-700 p-1  px-3 lg:ml-2 lg:mt-0 mt-4 lg:text-right text-left lg:overflow-scroll"
              placeholder="Descripción"
              value={descripciones[index] || item.descripcion || ''}
              onChange={(e) => handleDescriptionChange(index, e.target.value)}
            />
          </div>
        ))}</div>
  </div>
        <div className="flex justify-between mt-8">
          <button
            className="text-white bg-sky-900 rounded-xl hover:bg-indigo-900 font-bold py-2 px-4 "
            onClick={handleFacturar}>
            Facturar
          </button>
          <button
            className="rounded-xl bg-gray-100 text-gray-600 hover:bg-slate-200 hover:text-sky-800 transition duration-200 font-bold py-2 px-4 "
            onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>

      {/* Modal para guardar o imprimir la factura */}
      {showModal && (
        <div className="fixed inset-0 lg:w-full w-5/12 lg:mt-0 mt-8 lg:ml-0 ml-6 mr-6 lg:flex items-center lg:justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="lg:text-xl text-2xl font-bold mb-4">Factura generada correctamente.</h2>
            <div className="lg:block hidden">
            {/* Vista previa del PDF */}
            <PDFViewer style={{ width: '100%', height: '400px' }}>
              <FacturaPDF />
            </PDFViewer>
            </div>
            <PDFDownloadLink document={<FacturaPDF />} fileName={`factura_${facturaId}.pdf`}>
              {({ loading }) => (
                <button className="lg:mt-4 lg:mr-3 mr-12 px-2 py-2 font-medium text-white bg-sky-900 rounded-xl hover:bg-indigo-900">
                  {loading ? 'Generando PDF...' : 'Guardar PDF'}
                </button>
              )}
            </PDFDownloadLink>
          
            <button
              className="lg:mt-4 lg:mr-3 px-2 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-slate-200 hover:text-sky-800"
              onClick={() => {
                setShowModal(false);
                onClose();
              }}>
              Cerrar
            </button>
          
          </div>
        </div>
      )}
    </div>
  );
}

Factura.propTypes = {
  subtotal: PropTypes.number.isRequired,
  totalIVA: PropTypes.number.isRequired,
  totalVenta: PropTypes.number.isRequired,
  carrito: PropTypes.array.isRequired,
  selectedCliente: PropTypes.shape({
    nombre: PropTypes.string,
    correo: PropTypes.string,
  }), 
  onClose: PropTypes.func.isRequired,
};
