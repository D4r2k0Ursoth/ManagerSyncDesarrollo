import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Header.jsx'; 
import { Footer } from '../Footer.jsx'; 
import { Sidebar } from '../Sidebar.jsx';
import { useAccountManagement } from '../hooks/useAccountManagement'; // Importa el hook
import jsPDF from "jspdf";  // Importa jsPDF para generar el PDF
import 'jspdf-autotable'; // Importa jsPDF autotable

export function ConsultarCompras() {
  const navigate = useNavigate();
  const { logout } = useAccountManagement(); 
  const [compras, setCompras] = useState([]); 
  const [filteredCompras, setFilteredCompras] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [selectedDate, setSelectedDate] = useState(''); // Estado para filtrar por fecha
  const [selectedTipoCompra, setSelectedTipoCompra] = useState(''); // Estado para filtrar por tipo de compra
  const [modalVisible, setModalVisible] = useState(false); 
  const [selectedCompra, setSelectedCompra] = useState(null); 

  // Función para obtener las compras desde la API
  const fetchCompras = async () => {
    try {
      const response = await fetch('http://localhost/managersyncbdf/public/api/compras/all');
        if (!response.ok) {
          throw new Error('Error fetching data');
        }

      const data = await response.json(); 
        setCompras(data); 
        setFilteredCompras(data);
        setLoading(false);
      
    } catch (error) {
        console.error('Error fetching compras:', error);
        setError(error.message); 
        setLoading(false); 
    }
  };

  
  useEffect(() => {
    fetchCompras();
    }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    applyFilters(e.target.value, selectedDate, selectedTipoCompra);
  };

  // Función para filtrar por fecha
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setSelectedDate(selectedDate);
    applyFilters(searchQuery, selectedDate, selectedTipoCompra);
  };

  // Función para filtrar por tipo de compra
  const handleTipoCompraChange = (e) => {
    const tipoCompra = e.target.value;
    setSelectedTipoCompra(tipoCompra);
    applyFilters(searchQuery, selectedDate, tipoCompra);
  };

  // Función para aplicar los filtros
  const applyFilters = (searchQuery, date, tipoCompra) => {
    let filtered = compras;

    if (searchQuery) {
      filtered = filtered.filter((compra) =>
        compra.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        compra.identificacion.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (date) {
      filtered = filtered.filter((compra) => {
        const compraDate = new Date(compra.created_at).toISOString().split('T')[0];
        return compraDate === date;
      });
    }

    if (tipoCompra) {
      filtered = filtered.filter((compra) => compra.tipo_compra.toLowerCase() === tipoCompra.toLowerCase());
    }

    setFilteredCompras(filtered);
  };


  const handleRegistrarCompraManual = () => {
    navigate('/Compras'); 
  };


  const handleReporteGeneral = () => {
    const doc = new jsPDF('landscape', 'px', 'a4'); // Cambiar a orientación horizontal
    doc.setFontSize(12);
  
    const pageWidth = doc.internal.pageSize.getWidth(); // Obtener el ancho de la página
    const text = "Reporte de Compras y Gastos"; // El texto que deseas centrar
    const textWidth = doc.getTextWidth(text); // Obtener el ancho del texto
    const textX = (pageWidth - textWidth) / 2.5; // Calcular la posición X para centrar
    
    // Obtener la fecha actual
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  
    // Agregar el título centrado y la fecha a la derecha
    doc.text(text, textX, 20); // Imprimir el texto centrado en X
    doc.text(`Fecha de creación: ${formattedDate}`, pageWidth - 180, 20); // Mostrar la fecha en la parte superior derecha
  
    // Generar la tabla
    doc.autoTable({
      head: [['ID', 'Condición Venta', 'Moneda', 'Tipo Identificación', 'Identificación', 'Nombre', 'Tipo Cambio', 'Tipo Compra', 'Plazo', 'Observación', 'Subtotal', 'Impuestos', 'Descuentos', 'Total', 'Fecha Creación']], // Agregamos la columna de 'Fecha Creación'
      body: filteredCompras.map(compra => [
        compra.id,
        compra.condicion_venta,
        compra.moneda,
        compra.tipo_identificacion,
        compra.identificacion,
        compra.nombre,
        compra.tipo_cambio,
        compra.tipo_compra,
        compra.plazo,
        compra.observacion,
        compra.sub_total,
        compra.impuestos,
        compra.descuentos,
        compra.total,
        new Date(compra.created_at).toLocaleDateString('es-ES') // Incluimos la fecha creada en el PDF
      ]),
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [22, 160, 13] }, // Color de fondo solo para el encabezado
      styles: { cellPadding: 2, fontSize: 6 }, // Estilos globales
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 40 },
        4: { cellWidth: 40 },
        5: { cellWidth: 50 },
        6: { cellWidth: 30 },
        7: { cellWidth: 30 },
        8: { cellWidth: 30 },
        9: { cellWidth: 40 },
        10: { cellWidth: 30 },
        11: { cellWidth: 30 },
        12: { cellWidth: 30 },
        13: { cellWidth: 30 },
        14: { cellWidth: 40 } // Ajustamos el ancho para la fecha de creación
      },
      bodyStyles: { fillColor: [255, 255, 255] }, // Asegura que el fondo de las filas sea blanco
    });
    
    doc.save('Reporte_Compras.pdf'); // Guardar el PDF
  };

  // Función para descargar tiquete individual en PDF
  const handleDescargarTiquete = (compra) => {
    const doc = new jsPDF('landscape', 'px', 'a4');
    doc.setFontSize(12);

    const pageWidth = doc.internal.pageSize.getWidth();
    const text = `Tiquete de Compra - ID: ${compra.id}`;
    const textWidth = doc.getTextWidth(text);
    const textX = (pageWidth - textWidth) / 2;

    doc.text(text, textX, 20);

    doc.autoTable({
      head: [['ID', 'Condición Venta', 'Moneda', 'Tipo Identificación', 'Identificación', 'Nombre', 'Tipo Cambio', 'Tipo Compra', 'Plazo', 'Observación', 'Subtotal', 'Impuestos', 'Descuentos', 'Total', 'Fecha Creación']],
      body: [
        [
          compra.id,
          compra.condicion_venta,
          compra.moneda,
          compra.tipo_identificacion,
          compra.identificacion,
          compra.nombre,
          compra.tipo_cambio,
          compra.tipo_compra,
          compra.plazo,
          compra.observacion,
          compra.sub_total,
          compra.impuestos,
          compra.descuentos,
          compra.total,
          new Date(compra.created_at).toLocaleDateString('es-ES') // Incluimos la fecha de creación
        ]
      ],
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [22, 160, 13] },
      styles: { cellPadding: 2, fontSize: 8 },
    });

    doc.save(`Tiquete_Compra_${compra.id}.pdf`);
  };


  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta factura?')) {
      fetch(`http://localhost/managersyncbdf/public/api/compras/${id}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            fetchCompras(); 
          } else {
            console.error('Error al eliminar la factura', response.statusText);
          }
        })
        .catch(error => console.error('Error:', error));
    }
  };


  const handleEdit = (compra) => {
    setSelectedCompra(compra); 
    setModalVisible(true); 
  };


  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(`http://localhost/managersyncbdf/public/api/compras/${selectedCompra.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedCompra), 
    })
      .then(response => {
        if (response.ok) {
          fetchCompras(); 
          setModalVisible(false); 
        } else {
          console.error('Error al actualizar la factura', response.statusText);
        }
      })
      .catch(error => console.error('Error:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCompra({ ...selectedCompra, [name]: value }); 
  };

  return (
<>
<Header/>
    <div className="bg-slate-300  w-screen flex h-max  gap-0 overscroll-x-none">
      
        <div className="basis-1/4 mr-4 h-full">
          <Sidebar logout={logout} />
        </div>

        
        <div className="lg:basis-2/4 flex-grow py-2 pt-12 p-6 mx-auto mt-6 lg:ml-0 -ml-10 mr-16 mb-4 h-min bg-white rounded-lg shadow-lg w-9/12" >
          <h1 className="lg:text-3xl text-2xl font-bold text-gray-800 mb-6">Consultar Historial de Compras</h1>

          
          <div className="mb-4 lg:space-y-0 space-y-4 lg:flex lg:space-x-4">
            <input
              type="text"
              placeholder="Buscar por nombre o identificación..."
              className="italic w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {/* Selector de fecha */}
            <input
              type="date"
              className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
              onChange={handleDateChange} // Función que manejará el filtro por fecha
            />
            {/* Selector de tipo de compra */}
            <select
              className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
              onChange={handleTipoCompraChange} // Función que manejará el filtro por tipo de compra
            >
              <option value="">Seleccionar Tipo de Compra</option>
              <option value="deducible">Deducible</option>
              <option value="no_deducible">No_deducible</option>
            </select>
          </div>

          {/* Botones de acciones */}
          <div className="flex mb-8 space-x-4">
            <button
              onClick={handleRegistrarCompraManual}
              className="text-sm font-medium mt-4 px-4 py-2 rounded-xl text-white bg-sky-900  hover:bg-indigo-900 w-full0 transition duration-200">
              Registrar Compra Manual
            </button>
            <button
              onClick={handleReporteGeneral}
              className="text-sm font-medium mt-4 ml-3 px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-slate-200 hover:text-sky-800 transition duration-200">
              Generar reporte
            </button>
          </div>

          {/* Mostrar el estado de carga o error */}
          {loading && <p className="text-center">Cargando compras...</p>}
          {error && <p className="text-center text-pink-700">Error: {error}</p>}

          {/* Mostrar mensaje si no hay compras registradas */}
          {!loading && filteredCompras.length === 0 && (
            <p className="text-center m-9 text-gray-600 font-semibold">No hay compras registradas</p>
          )}

          {/* Tabla de compras */}
          {!loading && filteredCompras.length > 0 && (
            <div className="relative overflow-x-auto shadow-md rounded-lg">
              <table className="min-w-full bg-white shadow-md rounded-lg lg:ml-0 ml-3 lg:mr-0 mr-3 lg:mb-0 mb-7 overflow-hidden">
              <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <tr>
                    <th className="py-3 px-6 text-left border-b">ID Factura</th>
                    <th className="py-3 px-6 text-left border-b">Condición Venta</th>
                    <th className="py-3 px-6 text-left border-b">Moneda</th>
                    <th className="py-3 px-6 text-left border-b">Tipo Identificación</th>
                    <th className="py-3 px-6 text-left border-b">Identificación</th>
                    <th className="py-3 px-6 text-left border-b">Nombre</th>
                    <th className="py-3 px-6 text-left border-b">Tipo Cambio</th>
                    <th className="py-3 px-6 text-left border-b">Tipo Compra</th>
                    <th className="py-3 px-6 text-left border-b">Plazo</th>
                    <th className="py-3 px-6 text-left border-b">Observación</th>
                    <th className="py-3 px-6 text-left border-b">Subtotal</th>
                    <th className="py-3 px-6 text-left border-b">Impuestos</th>
                    <th className="py-3 px-6 text-left border-b">Descuentos</th>
                    <th className="py-3 px-6 text-left border-b">Total</th>
                    <th className="py-3 px-6 text-left border-b">Fecha de creación</th> {/* Nueva columna para la fecha */}
                    <th className="py-3 px-6 text-left border-b">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                  {filteredCompras.map((compra, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-6 text-left">{compra.id}</td>
                      <td className="py-3 px-6 text-left">{compra.condicion_venta}</td>
                      <td className="py-3 px-6 text-left">{compra.moneda}</td>
                      <td className="py-3 px-6 text-left">{compra.tipo_identificacion}</td>
                      <td className="py-3 px-6 text-left">{compra.identificacion}</td>
                      <td className="py-3 px-6 text-left">{compra.nombre}</td>
                      <td className="py-3 px-6 text-left">{compra.tipo_cambio}</td>
                      <td className="py-3 px-6 text-left">{compra.tipo_compra}</td>
                      <td className="py-3 px-6 text-left">{compra.plazo}</td>
                      <td className="py-3 px-6 text-left">{compra.observacion}</td>
                      <td className="py-3 px-6 text-left">{compra.sub_total}</td>
                      <td className="py-3 px-6 text-left">{compra.impuestos}</td>
                      <td className="py-3 px-6 text-left">{compra.descuentos}</td>
                      <td className="py-3 px-6 text-left">{compra.total}</td>
                      <td className="py-3 px-6 text-left">
                        {new Date(compra.created_at).toLocaleDateString('es-ES')} {/* Mostrar la fecha creada en la tabla */}
                      </td>
                      <td className="py-3 px-6 text-left">
                        <button 
                          onClick={() => handleEdit(compra)} 
                          className="text-sm text-center font-medium mt-1 px-10 py-1 rounded-xl bg-gray-50 text-gray-600 hover:bg-slate-200 hover:text-sky-800 transition duration-200" >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(compra.id)} 
                          className="text-sm text-center font-medium mt-4 px-9 py-1 rounded-xl bg-gray-50 text-gray-600 hover:bg-slate-200 hover:text-sky-800 transition duration-200" >
                          Eliminar
                        </button>
                        <button
                          onClick={() => handleDescargarTiquete(compra)}
                          className="text-sm text-center font-medium mt-4 px-6 py-1 rounded-xl bg-gray-50 text-gray-600 hover:bg-slate-200 hover:text-sky-800 transition duration-200" >
                          Descargar tiquete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      

      {/* Modal para editar la compra */}
      {modalVisible && selectedCompra && (
        <div className="fixed inset-0 lg:flex items-center justify-center bg-gray-800 bg-opacity-50 ">
          <div className="bg-white p-6 rounded-lg shadow-md lg:w-1/2 w-80 max-h-screen lg:mt-0 mt-10 lg:ml-0 ml-6 lg:mr-0">
            <h2 className="text-2xl font-bold mb-7">Editar Compra</h2>
            <div className="overflow-y-scroll overscroll-x-none scroll-mx-1 p-5 h-96">
              <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-4 lg:space-y-4 space-y-2">
              {/* Input para Condición Venta */}
              <div>
                <label className="block text-gray-700 ml-0.5 font-semibold">Condición Venta</label>
                <input
                  type="text"
                  name="condicion_venta"
                  className="w-full ml-0.5 mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                  value={selectedCompra.condicion_venta || ''}
                  onChange={handleInputChange}
                />
              </div>

              {/* Input para Moneda */}
              <div>
              <label className="block text-gray-700 ml-0.5 lg:-mt-4 mt-4 font-semibold">Moneda</label>
              <input
                  type="text"
                  name="moneda"
                  className="w-full ml-0.5 mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                  value={selectedCompra.moneda || ''}
                  onChange={handleInputChange}
                />
              </div>

              {/* Input para Tipo Identificación */}
              <div>
                <label className="block text-gray-700 ml-0.5 lg:-mt-4 font-semibold">Tipo Identificación</label>
                <input
                  type="text"
                  name="tipo_identificacion"
                  className="w-full ml-0.5 mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                  value={selectedCompra.tipo_identificacion || ''}
                  onChange={handleInputChange}
                />
              </div>

              {/* Input para Identificación */}
              <div>
                <label className="block text-gray-700 ml-0.5 lg:-mt-4 mt-6 font-semibold">Identificación</label>
                <input
                  type="text"
                  name="identificacion"
                  className="w-full ml-0.5 mt-2 p-3 lg:mb-0 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                  value={selectedCompra.identificacion || ''}
                  onChange={handleInputChange}
                />
              </div>

              {/* Input para Nombre */}
              <div>
                <label className="block text-gray-700 ml-0.5 -mt-4 font-semibold">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  className="w-full ml-0.5 mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                  value={selectedCompra.nombre || ''}
                  onChange={handleInputChange}
                />
              </div>

              {/* Input para Tipo de Cambio */}
              <div>
                <label className="block text-gray-700 ml-0.5 -mt-4 font-semibold">Tipo Cambio</label>
                <input
                  type="number"
                  name="tipo_cambio"
                  className="w-full ml-0.5 mt-2 p-3 lg:mb-0 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                  value={selectedCompra.tipo_cambio || ''}
                  onChange={handleInputChange}
                />
              </div>

              {/* Input para Subtotal */}
              <div>
                <label className="block text-gray-700 ml-0.5 -mt-4 font-semibold">Subtotal</label>
                <input
                  type="number"
                  name="sub_total"
                  className="w-full ml-0.5 mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                  value={selectedCompra.sub_total || ''}
                  onChange={handleInputChange}
                />
              </div>

              {/* Input para Impuestos */}
              <div>
                <label className="block text-gray-700 ml-0.5 -mt-4 font-semibold">Impuestos</label>
                <input
                  type="number"
                  name="impuestos"
                  className="w-full ml-0.5 mt-2 p-3 lg:mb-0 mb-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                  value={selectedCompra.impuestos || ''}
                  onChange={handleInputChange}
                />
              </div>

              {/* Input para Descuentos */}
              <div>
                <label className="block text-gray-700 ml-0.5 -mt-4 font-semibold">Descuentos</label>
                <input
                  type="number"
                  name="descuentos"
                  className="w-full ml-0.5 mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                  value={selectedCompra.descuentos || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-span-2 flex justify-between mt-4">
                <button
                  type="submit"
                  className="px-5 my-4 py-2.5 text-center font-medium text-white bg-sky-900 rounded-xl hover:bg-indigo-900 focus:ring-4 focus:outline-none focus:ring-blue-200">
                  Actualizar
                </button>
                <button
                  type="button"
                  onClick={() => setModalVisible(false)}
                  className="px-5 my-4 py-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-slate-200 hover:text-sky-800 transition duration-200 font-bold">
                  Cancelar
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer fijo al final de la página */}

    </div>      
    <footer className="text-center w-full ">
        <Footer />
      </footer>
  </>
  );
}
