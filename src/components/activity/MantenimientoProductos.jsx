import { useState, useEffect } from 'react';
import { Header } from '../Header.jsx';
import { Footer } from '../Footer.jsx';
import { Sidebar } from '../Sidebar.jsx';
import { CabysModal } from './CabysModal.jsx';
import { useUser } from '../hooks/UserContext';
import { useAccountManagement } from '../hooks/useAccountManagement';
import { Loading } from './Loading.jsx';


export function MantenimientoProductos() {
  const { user } = useUser();
  const [codigoProducto, setCodigoProducto] = useState('');
  const [codigoCabys, setCodigoCabys] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precioCompra, setPrecioCompra] = useState('');
  const [precioConsumidor, setPrecioConsumidor] = useState('');
  const [stock, setStock] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('');
  const [pesoPorUnidad, setPesoPorUnidad] = useState('');
  const [porcentajeDescuento, setPorcentajeDescuento] = useState(0);
  const [porcentajeIVA, setPorcentajeIVA] = useState(0);
  const [categoria, setCategoria] = useState('');
  const [productos, setProductos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [editingProductId, setEditingProductId] = useState(null); // Para manejar la edición

  const { logout } = useAccountManagement();

  const fetchProductos = () => {
    setLoadingProductos(true);
    fetch('https://manaercynbdf-miccs.ondigitalocean.app/api/productos/all')
      .then((response) => response.json())
      .then((data) => {
        const productosFiltrados = data.filter(
          (producto) => producto.empresa_id === user?.empresa_id
        );
        setProductos(productosFiltrados);
        setLoadingProductos(false);
      })
      .catch((error) => {
        console.error('Error al obtener los productos:', error);
        setLoadingProductos(false);
      });
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const clearForm = () => {
    setCodigoProducto('');
    setCodigoCabys('');
    setNombre('');
    setDescripcion('');
    setPrecioCompra('');
    setPrecioConsumidor('');
    setStock('');
    setUnidadMedida('');
    setPesoPorUnidad('');
    setPorcentajeDescuento(0);
    setPorcentajeIVA(0);
    setCategoria('');
    setEditingProductId(null);
  };
  const handleSelectCabys = (item) => {
    setCodigoCabys(item.codigo); // Cargar el código CABYS
    setDescripcion(item.descripcion); // Cargar la descripción del producto
    setCategoria(item.categoria ); // Cargar la primera categoría disponible o un valor por defecto
    setPorcentajeIVA(item.impuesto || 0); // Cargar el porcentaje de IVA
    setNombre(item.descripcion); // Opcional: asignar el nombre automáticamente si aplica
    setIsModalOpen(false); // Cerrar el modal
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const producto = {
      empresa_id: user?.empresa_id || '',
      codigo_producto: codigoProducto,
      codigo_cabys: codigoCabys,
      nombre,
      descripcion,
      precio_compra: parseFloat(precioCompra),
      precio_consumidor: parseFloat(precioConsumidor),
      stock: parseInt(stock, 10),
      unidad_medida: unidadMedida,
      peso_por_unidad: parseFloat(pesoPorUnidad),
      porcentaje_descuento: parseFloat(porcentajeDescuento),
      porcentaje_iva: parseFloat(porcentajeIVA),
      categoria,
    };

    if (editingProductId) {
      // Editar producto existente
      fetch(`https://manaercynbdf-miccs.ondigitalocean.app/api/productos/${editingProductId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto),
      })
        .then((response) => {
          if (!response.ok) throw new Error('Error al actualizar producto');
          return response.json();
        })
        .then(() => {
          clearForm();
          fetchProductos();
        })
        .catch((error) => console.error('Error al actualizar producto:', error));
    } else {
      // Agregar nuevo producto
      fetch('https://manaercynbdf-miccs.ondigitalocean.app/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto),
      })
        .then((response) => {
          if (!response.ok) throw new Error('Error al crear producto');
          return response.json();
        })
        .then(() => {
          clearForm();
          fetchProductos();
        })
        .catch((error) => console.error('Error al crear producto:', error));
    }
  };

  const handleEdit = (producto) => {
    setCodigoProducto(producto.codigo_producto);
    setCodigoCabys(producto.codigo_cabys);
    setNombre(producto.nombre);
    setDescripcion(producto.descripcion);
    setPrecioCompra(producto.precio_compra);
    setPrecioConsumidor(producto.precio_consumidor);
    setStock(producto.stock);
    setUnidadMedida(producto.unidad_medida);
    setPesoPorUnidad(producto.peso_por_unidad);
    setPorcentajeDescuento(producto.porcentaje_descuento);
    setPorcentajeIVA(producto.porcentaje_iva);
    setCategoria(producto.categoria);
    setEditingProductId(producto.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      fetch(`https://manaercynbdf-miccs.ondigitalocean.app/api/productos/${id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) throw new Error('Error al eliminar producto');
          return response.json();
        })
        .then(() => {
          fetchProductos();
        })
        .catch((error) => console.error('Error al eliminar producto:', error));
    }
  };

  if (loadingProductos) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-slate-300 w-screen flex h-fit gap-0 overflow-x-hidden">
        <div className="basis-1/4 mr-4 h-full">
          <Sidebar logout={logout} />
        </div>
        <div className="lg:flex lg:gap-4">
        <div className="py-2 lg:w-max w-3/12 lg:min-w-max  h-min pt-12 p-6 mx-auto mt-6  mb-4 ml-1 lg:ml-3 mr-4 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 -mt-2">
              {editingProductId ? 'Actualizar Producto' : 'Registrar Producto'}
            </h1>
            <div className="bg-white p-2 mb-6 rounded-lg shadow-md">
              <button
                onClick={() => setIsModalOpen(true)}
                className="-mt-4 px-2 py-2 text-white bg-sky-900 rounded-xl hover:bg-indigo-900 w-full font-bold transition duration-200">
                Seleccionar CABYS
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-4 lg:gap-y-7">
              <div>
                <label className="block text-gray-700 font-semibold">Código CABYS</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={codigoCabys}
                  onChange={(e) => setCodigoCabys(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Código de Producto</label>
                <input
                  type="text"
                  className="w-full  p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={codigoProducto}
                  onChange={(e) => setCodigoProducto(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Nombre del producto</label>
                <input
                  type="text"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Descripción</label>
                <textarea
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Precio de Compra</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={precioCompra}
                  onChange={(e) => setPrecioCompra(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Precio de Consumidor</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={precioConsumidor}
                  onChange={(e) => setPrecioConsumidor(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Cantidad en inventario</label>
                <input
                  type="number"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Unidad de Medida</label>
                <select
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={unidadMedida}
                  onChange={(e) => setUnidadMedida(e.target.value)}
                  required
                >
                  <option value="">Seleccionar Unidad de Medida</option>
                  <option value="kg">Kilogramos (kg)</option>
                  <option value="g">Gramos (g)</option>
                  <option value="lb">Libras (lb)</option>
                  <option value="oz">Onzas (oz)</option>
                  <option value="l">Litros (l)</option>
                  <option value="ml">Mililitros (ml)</option>
                  <option value="cm">Centímetros (cm)</option>
                  <option value="m">Metros (m)</option>
                  <option value="in">Pulgadas (in)</option>
                  <option value="ft">Pies (ft)</option>
                  <option value="Sp">Servicios profesionales (Sp)</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Peso por unidad</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={pesoPorUnidad}
                  onChange={(e) => setPesoPorUnidad(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">% Descuento</label>
                <input
                  type="number"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={porcentajeDescuento}
                  onChange={(e) => setPorcentajeDescuento(e.target.value)}
                  min="0"
                  max="100"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">% IVA</label>
                <input
                  type="number"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={porcentajeIVA}
                  onChange={(e) => setPorcentajeIVA(e.target.value)}
                  min="0"
                  max="100"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Categoría</label>
                <input
                  type="text"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-around my-6 gap-4">
                <button
                  type="submit"
                  className="bg-sky-900 text-sm text-center font-medium mb-3 mt-3 px-4 py-2 rounded-xl text-white shadow hover:bg-indigo-900 transition duration-200">
                  {editingProductId ? 'Actualizar' : 'Agregar'}
                </button>
                <button
                  type="button"
                  onClick={clearForm}
                  className="text-sm text-center font-medium mb-3 mt-3 px-6 py-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-slate-200 hover:text-sky-800 transition duration-200">
                  Cancelar
                </button>
              </div>
            </form>
          </div>

          <div className="lg:flex">
          <div className="lg:basis-1/4 lg:max-h-[80rem] lg:gap-4 lg:w-5/12 w-3/12 py-2 mb-4 h-min lg:ml-0 ml-1 pt-12 p-6 mx-auto mt-6 pb-12 bg-white rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 -mt-2">Productos Registrados</h2>
              <div className="overflow-scroll px-2">
                <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                  <thead className="bg-gray-100 text-gray-600 uppercase text-sm text-center rounded-xl">
                    <tr>
                      <th className="p-3 text-left">Código CABYS</th>
                      <th className="p-3 text-left">Código Producto</th>
                      <th className="p-3 text-left">Nombre</th>
                      <th className="p-3 text-left">Descripción</th>
                      <th className="p-3 text-left">Precio Compra</th>
                      <th className="p-3 text-left">Precio Consumidor</th>
                      <th className="p-3 text-left">Stock</th>
                      <th className="p-3 text-left">Unidad Medida</th>
                      <th className="p-3 text-left">Peso Unidad</th>
                      <th className="p-3 text-left">Categoría</th>
                      <th className="p-3 text-left">% IVA</th>
                      <th className="p-3 text-left">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map((producto) => (
                      <tr key={producto.id} className="border-b border-gray-200 text-sm">
                        <td className="p-3">{producto.codigo_cabys}</td>
                        <td className="p-3">{producto.codigo_producto}</td>
                        <td className="p-3">{producto.nombre}</td>
                        <td className="p-3">{producto.descripcion}</td>
                        <td className="p-3">{parseFloat(producto.precio_compra).toFixed(2)}</td>
                        <td className="p-3">{parseFloat(producto.precio_consumidor).toFixed(2)}</td>
                        <td className="p-3">{producto.stock}</td>
                        <td className="p-3">{producto.unidad_medida}</td>
                        <td className="p-3">{producto.peso_por_unidad}</td>
                        <td className="p-3">{producto.categoria}</td>
                        <td className="p-3">{producto.porcentaje_iva}%</td>
                        <td className="p-3">
                          <button
                            onClick={() => handleEdit(producto)}
                            className="text-sm text-center font-medium mt-1 px-8 mb-3 py-1 rounded-xl bg-gray-50 text-gray-600 hover:bg-slate-200 hover:text-sky-800 transition duration-200">
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(producto.id)}
                            className="text-sm text-center font-medium mt-1 px-6 py-1 rounded-xl bg-gray-50 text-gray-600 hover:bg-slate-200 hover:text-sky-800 transition duration-200">
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CabysModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCabysSelect={handleSelectCabys}
      />
      <Footer />
    </>
  );
}
