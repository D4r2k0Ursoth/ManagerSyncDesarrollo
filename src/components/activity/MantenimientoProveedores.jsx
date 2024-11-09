import React, { useEffect, useState } from 'react';
import { Header } from '../Header.jsx';
import { Footer } from '../Footer.jsx';
import { useAccountManagement } from '../hooks/useAccountManagement'; 
import { Sidebar } from '../Sidebar.jsx';
import { Loading } from './Loading.jsx';

export function MantenimientoProveedores() {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [cedulaJuridica, setCedulaJuridica] = useState('');
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState(null);
  const { logout } = useAccountManagement(); // Usa el hook para obtener la función logout

  const fetchProveedores = () => {
    fetch('http://localhost/managersyncbdf/public/api/proveedores/all')
      .then(response => response.json())
      .then(data => {
        setProveedores(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching proveedores:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const proveedor = {
      nombre,
      direccion,
      telefono,
      email,
      cedula_juridica: cedulaJuridica,
    };

    fetch('http://localhost/managersyncbdf/public/api/proveedores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(proveedor),
    })
      .then(response => response.json())
      .then(() => {
        setNombre('');
        setDireccion('');
        setTelefono('');
        setEmail('');
        setCedulaJuridica('');
        fetchProveedores(); // Refetch proveedores después de agregar
      })
      .catch(error => console.error('Error:', error));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost/managersyncbdf/public/api/proveedores/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          fetchProveedores(); // Refetch proveedores después de eliminar
        } else {
          console.error('Error al eliminar el proveedor', response.statusText);
        }
      })
      .catch(error => console.error('Error:', error));
  };

  const handleEdit = (proveedor) => {
    setNombre(proveedor.nombre);
    setDireccion(proveedor.direccion);
    setTelefono(proveedor.telefono);
    setEmail(proveedor.email);
    setCedulaJuridica(proveedor.cedula_juridica);
    setEditingProveedor(proveedor.id);
    setModalVisible(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    
    const updatedProveedor = {
      nombre,
      direccion,
      telefono,
      email,
      cedula_juridica: cedulaJuridica,
    };

    fetch(`http://localhost/managersyncbdf/public/api/proveedores/${editingProveedor}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProveedor),
    })
      .then(response => {
        if (response.ok) {
          fetchProveedores(); // Refetch proveedores después de actualizar
          setModalVisible(false);
          setEditingProveedor(null);
          setNombre('');
          setDireccion('');
          setTelefono('');
          setEmail('');
          setCedulaJuridica('');
        } else {
          console.error('Error al actualizar el proveedor', response.statusText);
        }
      })
      .catch(error => console.error('Error:', error));
  };

  if (loading) return <div className='duration-700'> <Loading/></div>;

  return (
    <>
    <Header/>
      <div className="bg-slate-300  w-screen flex h-max gap-0">
      <div className="basis-1/4 mr-4 h-full">
          <Sidebar logout={logout}/>
        </div>

        <div className="lg:flex gap-4">
          <div className="py-2 w-max min-w-max  h-min pt-12 p-6 mx-auto mt-6  mb-4 -ml-12 mr-4 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 -mt-2">Registrar Proveedor</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold">Nombre del proveedor</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Dirección</label>
                <textarea
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Teléfono</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Email</label>
                <input
                  type="email"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Cédula Jurídica</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={cedulaJuridica}
                  onChange={(e) => setCedulaJuridica(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="px-5 my-4 py-2.5 text-center font-medium text-white bg-sky-900 rounded-xl hover:bg-indigo-900 focus:ring-4 focus:outline-none focus:ring-blue-200">
                  Agregar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNombre('');
                    setDireccion('');
                    setTelefono('');
                    setEmail('');
                    setCedulaJuridica('');
                  }}
                  className="px-5 my-4 py-2.5 text-center font-medium rounded-2xl bg-gray-100 text-gray-600 hover:bg-slate-200 hover:text-sky-800 transition duration-200">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
          <div className="flex gap-6">
        <div className="lg:basis-2/4 lg:w-full w-6/12 py-2 h-min pt-12 p-6 mx-auto mt-6 pb-12 lg:ml-0 -ml-12 lg:mb-0 mb-12 bg-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 -mt-2">Proveedores Registrados</h2>
            <div className="overflow-x-scroll">
          <table className="w-full bg-white shadow-md rounded-lg lg:ml-2 ml-1 lg:mr-2 mr-1">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm text-center rounded-xl">
              <tr>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Dirección</th>
                <th className="p-3 text-left">Teléfono</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Cédula</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map((proveedor) => (
                <tr key={proveedor.id} className="border-b border-gray-200">
                  <td className="p-3">{proveedor.nombre}</td>
                  <td className="p-3">{proveedor.direccion}</td>
                  <td className="p-3">{proveedor.telefono}</td>
                  <td className="p-3">{proveedor.email}</td>
                  <td className="p-3">{proveedor.cedula_juridica}</td>
                  <td className="p-3">
                    <button 
                      onClick={() => handleEdit(proveedor)} 
                      className="text-sm text-center font-medium mt-1 px-8 py-1 rounded-xl bg-gray-50 text-gray-600 hover:bg-slate-200 hover:text-sky-800 transition duration-200" >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(proveedor.id)} 
                      className="text-sm text-center font-medium mt-1 px-6 py-1 rounded-xl bg-gray-50 text-gray-600 hover:bg-slate-200 hover:text-sky-800 transition duration-200" >
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
          {/* Modal para editar proveedor */}
          {modalVisible && (
            <div className="fixed inset-0 lg:flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-md lg:w-1/2 w-5/12 lg:mt-12 mt-6 lg:ml-0 ml-6 lg:mr-0 mr-3">
                <h2 className="text-2xl font-bold mb-4">Editar Proveedor</h2>
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold">Nombre del proveedor</label>
                    <input
                      type="text"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                  />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold">Dirección</label>
                    <textarea
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold">Teléfono</label>
                    <input
                      type="text"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold">Email</label>
                    <input
                      type="email"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold">Cédula Jurídica</label>
                    <input
                      type="text"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                      value={cedulaJuridica}
                      onChange={(e) => setCedulaJuridica(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="submit"
                      className="px-5 my-4 py-2.5 text-center font-medium text-white bg-sky-900 rounded-xl hover:bg-indigo-900 focus:ring-4 focus:outline-none focus:ring-blue-200">
                      Actualizar
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalVisible(false)}
                      className="px-5 my-4 py-2.5 text-sm text-center font-medium rounded-xl bg-gray-50 text-gray-600 hover:bg-slate-200 hover:text-sky-800 transition duration-200" >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

