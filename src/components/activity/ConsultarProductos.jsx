import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Header.jsx'; 
import { Footer } from '../Footer.jsx'; 
import { Sidebar } from '../Sidebar.jsx';
import { useAccountManagement } from '../hooks/useAccountManagement'; 
import { Loading } from '../activity/Loading.jsx';
export function HistorialInventario() {
  const navigate = useNavigate();
  const { logout } = useAccountManagement(); 
  const [productos, setProductos] = useState([]); 
  const [filteredProductos, setFilteredProductos] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [modalVisible, setModalVisible] = useState(false); 
  const [selectedProducto, setSelectedProducto] = useState(null); 

  // Función para obtener los productos desde la API
  const fetchProductos = async () => {
    try {
      const response = await fetch('http://localhost/managersyncbdf/public/api/productos/all');
      if (!response.ok) {
        throw new Error('Error fetching data');
      }
      const data = await response.json(); // Parseamos la respuesta como JSON
      setProductos(data); // Guardamos los productos en el estado
      setFilteredProductos(data); // Inicialmente, los productos filtrados son todos
      setLoading(false); // Deshabilitamos el estado de carga
    } catch (error) {
      console.error('Error fetching productos:', error);
      setError(error.message); // Guardamos el error en el estado
      setLoading(false); // Deshabilitamos el estado de carga
    }
  };

  // Llamar a la función para obtener los productos cuando el componente se monte
  useEffect(() => {
    fetchProductos();
  }, []);

  // Función para manejar el cambio en el campo de búsqueda
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      setFilteredProductos(productos); // Restablecer los productos filtrados si el campo de búsqueda está vacío
    } else {
      const filtered = productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(e.target.value.toLowerCase()) ||
        producto.codigo_producto.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredProductos(filtered); // Actualizar el estado de productos filtrados
    }
  };

  // Función para eliminar un producto
  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      fetch(`http://localhost/managersyncbdf/public/api/productos/${id}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            fetchProductos(); // Refetch productos después de eliminar
          } else {
            console.error('Error al eliminar el producto', response.statusText);
          }
        })
        .catch(error => console.error('Error:', error));
    }
  };

  // Función para abrir el modal de edición
  const handleEdit = (producto) => {
    setSelectedProducto(producto); // Almacenar el producto seleccionado en el estado
    setModalVisible(true); // Mostrar el modal
  };

  // Función para manejar la actualización del producto
  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(`http://localhost/managersyncbdf/public/api/productos/${selectedProducto.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedProducto), // Enviar los datos actualizados
    })
      .then(response => {
        if (response.ok) {
          fetchProductos(); // Refetch productos después de actualizar
          setModalVisible(false); // Ocultar el modal
        } else {
          console.error('Error al actualizar el producto', response.statusText);
        }
      })
      .catch(error => console.error('Error:', error));
  };

  // Función para manejar los cambios en los inputs del modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProducto({ ...selectedProducto, [name]: value }); // Actualizar el estado del producto seleccionado
  };

  return (
    <>
    <Header/>
    <div className="bg-slate-300  w-screen flex h-max  gap-0">
      

        <div className="basis-1/4 mr-4 h-full">
          <Sidebar logout={logout} />
        </div>
        
        <div className="lg:basis-2/4 lg:w-auto w-10/12 py-2 pt-12 mx-auto p-6 pb-14 mt-6 lg:ml-2 -ml-16 mb-4 bg-white rounded-lg shadow-lg h-min">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Historial de Inventario</h1>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar por nombre o código de producto"
              className="overflow-ellipsis w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600 mb-5"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          {/* Mostrar el estado de carga o error */}
          {loading && <p className="text-center">Cargando productos...</p>}
          {error && <p className="text-center text-pink-700">Error: {error}</p>}

          {/* Mostrar mensaje si no hay productos registrados */}
          {!loading && filteredProductos.length === 0 && (
            <p className="text-center text-gray-600 font-semibold mt-4">No hay productos registrados</p>
          )}

          {/* Tabla de productos */}
          {!loading && filteredProductos.length > 0 && (
            <div className="overflow-auto shadow-md rounded-lg">
              <table className="min-w-full bg-white border border-gray-200 h-svh max-h-svh">
                <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal ">
                  <tr>
                    <th className="py-3 px-6 text-left border-b">Código Producto</th>
                    <th className="py-3 px-6 text-left border-b">Nombre</th>
                    <th className="py-3 px-6 text-left border-b">Descripción</th>
                    <th className="py-3 px-6 text-left border-b">Stock</th>
                    <th className="py-3 px-6 text-left border-b">Precio Compra</th>
                    <th className="py-3 px-6 text-left border-b">Precio Venta</th>
                    <th className="py-3 px-6 text-left border-b">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                  {filteredProductos.map((producto, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-6 text-left">{producto.codigo_producto}</td>
                      <td className="py-3 px-6 text-left">{producto.nombre}</td>
                      <td className="py-3 px-6 text-left">{producto.descripcion}</td>
                      <td className="py-3 px-6 text-left">{producto.stock}</td>
                      <td className="py-3 px-6 text-left">{producto.precio_compra}</td>
                      <td className="py-3 px-6 text-left">{producto.precio_consumidor}</td>
                      <td className="py-3 px-6 text-left">
                        <button 
                          onClick={() => handleEdit(producto)} 
                          className="text-sm text-center font-medium mt-1 px-6 py-1 rounded-xl bg-gray-50 text-gray-600 hover:bg-slate-200 hover:text-sky-800 transition duration-200" >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(producto.id)} 
className="text-sm text-center font-medium mt-1 px-6 py-1 rounded-xl bg-gray-50 text-gray-600 hover:bg-slate-200 hover:text-sky-800 transition duration-200" >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      

      {/* Modal para editar el producto */}
      {modalVisible && selectedProducto && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/2 max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Editar Producto</h2>
            <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-4 space-y-4">
              {/* Input para Código de Producto */}
              <div>
                <label className="block text-gray-700 mb-1 font-semibold align-text-top">Código Producto</label>
                <input
                  type="text"
                  name="codigo_producto"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                  value={selectedProducto.codigo_producto || ''}
                  onChange={handleInputChange}
                />
              </div>

              {/* Input para Nombre */}
              <div>
                <label className="block text-gray-700 -mt-4 mb-1 font-semibold align-text-top">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                  value={selectedProducto.nombre || ''}
                  onChange={handleInputChange}
                />
              </div>

              {/* Input para Descripción */}
              <div>
                <label className="block text-gray-700 mb-1 font-semibold">Descripción</label>
                <textarea
                  name="descripcion"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                  value={selectedProducto.descripcion || ''}
                  onChange={handleInputChange}
                />
              </div>

              {/* Input para Stock */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Stock</label>
                <input
                  type="number"
                  name="stock"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                  value={selectedProducto.stock || ''}
                  onChange={handleInputChange}
                />
              </div>

              {/* Input para Precio de Compra */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Precio de Compra</label>
                <input
                  type="number"
                  name="precio_compra"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                  value={selectedProducto.precio_compra || ''}
                  onChange={handleInputChange}
                />
              </div>

              {/* Input para Precio de Venta */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Precio de Venta</label>
                <input
                  type="number"
                  name="precio_venta"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                  value={selectedProducto.precio_consumidor || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-span-2 flex justify-between mt-4">
                <button
                  type="submit"
                  className=" text-white bg-sky-900 rounded-xl hover:bg-indigo-900 font-semibold px-4 py-2 shadow transition duration-200">
                  Actualizar
                </button>
                <button
                  type="button"
                  onClick={() => setModalVisible(false)}
                  className="bg-gray-50 text-gray-600 hover:bg-slate-200 hover:text-sky-800 font-semibold px-4 py-2 rounded-md shadow transition duration-200">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
      {/* Footer fijo al final de la página */}
      <footer className="text-center w-full mt-auto">
        <Footer />
      </footer>
    
  </>
  );
}
