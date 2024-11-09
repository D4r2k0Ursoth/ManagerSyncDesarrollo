import { useState, useEffect } from 'react';
import { Header } from '../Header.jsx';
import { Footer } from '../Footer.jsx';
import { BackgroundAnimation } from './Background.jsx';
import { useAccountManagement } from '../hooks/useAccountManagement';
import { Sidebar } from '../Sidebar.jsx';
import { CabysModal } from './CabysModal.jsx';
import { useUser } from '../hooks/UserContext';
import { Loading } from './Loading.jsx';
import { div } from 'framer-motion/client';

export function MantenimientoProductos() {
  const {  user } = useUser();
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
  const [cabysData, setCabysData] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [loadingCabys, setLoadingCabys] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { logout } = useAccountManagement();

 const fetchProductos = () => {
  fetch('http://localhost/managersyncbdf/public/api/productos/all')
    .then(response => response.json())
    .then(data => {
      // Filtra los productos por empresa_id del usuario logueado
      const productosFiltrados = data.filter(producto => producto.empresa_id === user?.empresa_id);
      setProductos(productosFiltrados);
      console.log('Productos de la empresa:', productosFiltrados);
      setLoadingProductos(false);
    })
    .catch(error => {
      console.error('Error fetching productos:', error);
      setLoadingProductos(false);
    });
};


  const fetchCabysData = () => {
    fetch('http://localhost/managersyncbdf/public/api/cabys-json')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data.data)) {
          setCabysData(data.data);
          console.log('Datos CABYS:', data.data);
          const categorias = [...new Set(data.data.map(item => item.codigo_cabys_categoria_1))];
          setCategorias(categorias);
        } else {
          setCabysData([]);
        }
        setLoadingCabys(false);
      })
      .catch(error => {
        console.error('Error fetching CABYS data:', error);
        setLoadingCabys(false);
      });
  };

  useEffect(() => {
    fetchProductos();
    fetchCabysData();
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
    setEditingProduct(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Si estamos editando un producto, el ID no debe ser nulo
    const isEditing = editingProduct !== null;
  
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
      categoria
    };
  
    if (isEditing) {
      // Si se está editando, enviar una solicitud PUT con el ID correcto
      fetch(`http://localhost/managersyncbdf/public/api/productos/${editingProduct}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(producto),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al actualizar el producto');
        }
        return response.json();
      })
      .then(() => {
        clearForm();
        fetchProductos();
      })
      .catch(error => console.error('Error al actualizar producto:', error));
    } else {
      // Si no estamos editando, enviar una solicitud POST para crear uno nuevo
      fetch('http://localhost/managersyncbdf/public/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(producto),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al crear producto');
        }
        return response.json();
      })
      .then(() => {
        clearForm();
        fetchProductos();
      })
      .catch(error => console.error('Error al crear producto:', error));
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
    setEditingProduct(producto.id); // Guardar el ID del producto que se está editando
  };
  
  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      fetch(`http://localhost/managersyncbdf/public/api/productos/${id}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al eliminar el producto');
          }
          return response.json();
        })
        .then(() => {
          fetchProductos(); // Actualizar la lista de productos después de eliminar
        })
        .catch(error => console.error('Error al eliminar producto:', error));
    }
  };
  
  const handleSelectCabys = (item, categoriaIndex) => {
    const descripcion = item[`descripcion_categoria_${categoriaIndex}`];
    const impuesto = parseFloat(item.impuesto) || 0;

    setCodigoCabys(item[`codigo_cabys_categoria_${categoriaIndex}`] || '');
    setNombre(item.nombre || '');
    setDescripcion(descripcion || '');
    setPrecioCompra(item.precio_compra || '');
    setPrecioConsumidor(item.precio_consumidor || '');
    setStock(item.stock || '');
    setUnidadMedida(item.unidad_medida || '');
    setPesoPorUnidad(item.peso_por_unidad || '');
    setCategoria(descripcion || '');
    setPorcentajeIVA(impuesto);
    setIsModalOpen(false);
  };

  if (loadingProductos || loadingCabys) {
    return <div className='duration-700'> <Loading/> </div>;
  }

  return (
    <>
      <Header />
      <div className="bg-slate-300  w-screen flex h-max gap-0 overflow-x-hidden">
      <div className="basis-1/4 mr-4 h-full pb-96 lg:bg-slate-50">
          <Sidebar logout={logout}/>
        </div>
        <div className="lg:flex lg:gap-7">
          
          <div className="lg:basis-2/4 w-3/12 lg:w-96 py-2 h-min pt-12 p-6 mx-auto mt-6  mb-4 lg:ml-6 -ml-10 lg:mr-0  bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 -mt-2">{editingProduct ? 'Actualizar Producto' : 'Registrar Producto'}</h1>
                      {/* Botón para abrir el modal de CABYS */}
          <div className="bg-white p-2 mb-6 rounded-lg shadow-md">
            <button
              onClick={() => setIsModalOpen(true)}
              className="-mt-4 px-2 py-2 text-white bg-sky-900 rounded-xl hover:bg-indigo-900 w-full font-bold transition duration-200">
              Seleccionar CABYS
            </button>
          </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold">Código CABYS</label>
                <input
                  type="text"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={codigoCabys}
                  onChange={(e) => setCodigoCabys(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Código de Producto</label>
                <input
                  type="text"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
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
                  required
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">% IVA</label>
                <input
                  type="number"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={porcentajeIVA}
                  onChange={(e) => setPorcentajeIVA(e.target.value)}
                  required
                  min="0"
                  max="100"
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
              <div className="flex justify-between my-6">
                <button
                  type="submit"
                  className={`bg-${editingProduct ? 'sky-700' : 'sky-900'}  text-sm text-center font-medium mb-3 mt-3 px-4 py-2 rounded-xl text-white shadow hover:bg-${editingProduct ? 'indigo-700' : 'indigo-900'} transition duration-200`} >
                  {editingProduct ? 'Actualizar' : 'Agregar'}
                </button>
                <button
                  type="button"
                  onClick={clearForm}
                  className="text-sm text-center font-medium mt-1 px-6 py-1 rounded-xl bg-gray-50 text-gray-600 hover:bg-slate-200 hover:text-sky-800 transition duration-200" >
                  Cancelar
                </button>
              </div>
            </form>
          </div>

          <div className="lg:flex">
          <div className="lg:basis-2/4 lg:gap-4 lg:mr-10 lg:w-7/12 w-3/12 py-2 mb-4 h-min lg:ml-0 -ml-10 pt-12 p-6 mx-auto mt-6 pb-12 bg-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 -mt-2">Productos Registrados</h2>
          <div className="overflow-scroll px-2">

          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm text-center rounded-xl ">
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
                    <td className="p-3">
                    <button
                        onClick={() => handleEdit(cliente)}
                        className="text-sm text-center font-medium mt-1 px-8 mb-3 py-1 rounded-xl bg-gray-50 text-gray-600 hover:bg-slate-200 hover:text-sky-800 transition duration-200" >
                        Editar
                      </button>

                      <button
                        onClick={() => handleDelete(cliente.id)}
                        className="text-sm text-center font-medium mt-1 px-6 py-1 rounded-xl bg-gray-50 text-gray-600 hover:bg-slate-200 hover:text-sky-800 transition duration-200" >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Modal para mostrar la lista de CABYS */}
          <CabysModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            cabysData={cabysData}
            onCabysSelect={handleSelectCabys}
          />
        </div>
      </div>
      </div>
      </div>
      <Footer />
    </>
  );
}
