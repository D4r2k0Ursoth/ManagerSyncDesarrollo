import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Header.jsx'; 
import { Footer } from '../Footer.jsx'; 
import { Sidebar } from '../Sidebar.jsx';
import { useAccountManagement } from '../hooks/useAccountManagement'; 
import { Loading } from '../activity/Loading.jsx';

export function MantenimientoProductos() {
  const navigate = useNavigate();
  const { logout } = useAccountManagement(); 
  const [productos, setProductos] = useState([]); 
  const [filteredProductos, setFilteredProductos] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [modalVisible, setModalVisible] = useState(false); 
  const [selectedProducto, setSelectedProducto] = useState(null); 

  const fetchProductos = async () => {
    try {
      const response = await fetch('https://manaercynbdf-miccs.ondigitalocean.app/api/productos/all');
      if (!response.ok) throw new Error('Error fetching data');
      const data = await response.json();
      setProductos(data);
      setFilteredProductos(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredProductos(
      query
        ? productos.filter(producto => 
            producto.nombre.toLowerCase().includes(query) ||
            producto.codigo_producto.toLowerCase().includes(query)
          )
        : productos
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        const response = await fetch(`https://manaercynbdf-miccs.ondigitalocean.app/api/productos/${id}`, { method: 'DELETE' });
        if (response.ok) fetchProductos();
        else console.error('Error al eliminar el producto', response.statusText);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleEdit = (producto) => {
    setSelectedProducto(producto);
    setModalVisible(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://manaercynbdf-miccs.ondigitalocean.app/api/productos/${selectedProducto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedProducto),
      });
      if (response.ok) {
        fetchProductos();
        setModalVisible(false);
      } else console.error('Error al actualizar el producto', response.statusText);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProducto(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Header/>
      <div className="bg-slate-300 w-screen flex h-max gap-0">
        <Sidebar logout={logout} className="basis-1/4 mr-4 h-full" />
        <div className="lg:basis-2/4 lg:w-auto w-10/12 py-2 pt-12 mx-auto p-6 pb-14 mt-6 lg:ml-2 -ml-16 mb-4 bg-white rounded-lg shadow-lg h-min">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Mantenimiento de Productos</h1>
          <input
            type="text"
            placeholder="Buscar por nombre o código de producto"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600 mb-5"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {loading && <p className="text-center">Cargando productos...</p>}
          {error && <p className="text-center text-pink-700">Error: {error}</p>}
          {!loading && filteredProductos.length === 0 && (
            <p className="text-center text-gray-600 font-semibold mt-4">No hay productos registrados</p>
          )}
          {!loading && filteredProductos.length > 0 && (
            <div className="overflow-auto shadow-md rounded-lg">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <tr>
                    <th className="py-3 px-6 text-left">Código Producto</th>
                    <th className="py-3 px-6 text-left">Nombre</th>
                    <th className="py-3 px-6 text-left">Descripción</th>
                    <th className="py-3 px-6 text-left">Stock</th>
                    <th className="py-3 px-6 text-left">Precio Compra</th>
                    <th className="py-3 px-6 text-left">Precio Venta</th>
                    <th className="py-3 px-6 text-left">Acciones</th>
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
                        <button onClick={() => handleEdit(producto)} className="btn">Editar</button>
                        <button onClick={() => handleDelete(producto.id)} className="btn">Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {modalVisible && selectedProducto && (
          <div className="modal">
            <form onSubmit={handleUpdate}>
              {/* Form inputs for editing selectedProducto */}
              <input name="codigo_producto" value={selectedProducto.codigo_producto || ''} onChange={handleInputChange} />
              {/* Other inputs for nombre, descripcion, etc. */}
              <button type="submit">Actualizar</button>
              <button type="button" onClick={() => setModalVisible(false)}>Cancelar</button>
            </form>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
