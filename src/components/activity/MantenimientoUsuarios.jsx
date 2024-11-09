import { useState, useEffect } from 'react';
import { Header } from '../Header.jsx';
import { Footer } from '../Footer.jsx';
import { useAccountManagement } from '../hooks/useAccountManagement.js';
import { Sidebar } from '../Sidebar.jsx';
import { useUser } from '../hooks/UserContext';
import { Loading } from './Loading.jsx';

export function MantenimientoUsuarios() {
  const { token, user } = useUser(); // Obtener el token y la información del usuario del contexto
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    cedula: '',
    empresa_id: user?.empresa_id || '', // Cargar cédula de la empresa del usuario
   
    role: '', // Cambié el valor inicial a una cadena vacía para que el usuario seleccione
    password: '',
    password_confirmation: ''
  });
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [errors, setErrors] = useState({});
  const { logout } = useAccountManagement();

  // Función para obtener usuarios
  // Función para obtener usuarios
const fetchUsuarios = async () => {
  try {
    const response = await fetch('http://managersyncbdf.test/api/usuarios/all', {
      headers: {
        'Authorization': `Bearer ${token}` // Usar el token del contexto
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener usuarios');
    }

    const data = await response.json();
    // Filtrar usuarios que coincidan con el `empresa_id` del usuario logueado
    const filteredUsuarios = data.filter(usuario => usuario.empresa_id === user.empresa_id);
    setUsuarios(filteredUsuarios);
  } catch (error) {
    console.error('Error fetching usuarios:', error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchUsuarios();
  }, [token]); // Agregar token como dependencia

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: 'Las contraseñas no coinciden' });
      return;
    }

    try {
      const response = await fetch('http://managersyncbdf.test/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Usar el token del contexto
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrors(data.errors || {});
        return;
      }

      fetchUsuarios(); // Refetch usuarios después de agregar
      resetForm();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Función para manejar la eliminación de un usuario
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este usuario?');
    if (!confirmDelete) return; // Cancelar si el usuario no confirma

    try {
      const response = await fetch(`http://managersyncbdf.test/api/usuarios/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` // Usar el token del contexto
        }
      });

      if (response.ok) {
        fetchUsuarios(); // Refetch usuarios después de eliminar
      } else {
        console.error('Error al eliminar el usuario', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Función para manejar la edición de un usuario
  const handleEdit = (usuario) => {
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      cedula: usuario.cedula,
      empresa_id: user?.empresa_id || '', // Resetear id de empresa
     
      role: usuario.role,
      password: '',
      password_confirmation: ''
    });
    setEditingUsuario(usuario.id);
  };

  // Función para manejar la actualización de un usuario
  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedUsuario = { ...formData };

    try {
      const response = await fetch(`http://managersyncbdf.test/api/usuarios/${editingUsuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Usar el token del contexto
        },
        body: JSON.stringify(updatedUsuario),
      });

      if (response.ok) {
        fetchUsuarios(); // Refetch usuarios después de actualizar
        resetForm();
      } else {
        console.error('Error al actualizar el usuario', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Función para restablecer el formulario
  const resetForm = () => {
    setFormData({
      nombre: '',
      email: '',
      cedula: '',
      empresa_id: user?.empresa_id || '', // Resetear id de empresa
     
      role: '', // Cambié el valor inicial a una cadena vacía
      password: '',
      password_confirmation: ''
    });
    setEditingUsuario(null);
    setErrors({});
  };

  // Mostrar cargando mientras se obtienen usuarios
  if (loading) return <div className='duration-700'> <Loading/></div>;

  return (
    <>
      <Header />
      <div className="bg-slate-300 flex w-screen h-max">
        <div className='basis-1/4'>
          <Sidebar logout={logout} />
        </div>

        <div className="col-span-7 flex py-16">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-w-full pt-12 -mt-7 p-6 rounded-xl mx-auto bg-white">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 -mt-4">{editingUsuario ? 'Actualizar Usuario' : 'Registrar Usuario'}</h1>
            <form onSubmit={editingUsuario ? handleUpdate : handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Cédula</label>
                <input
                  type="text"
                  name="cedula"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={formData.cedula}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
  <label className="block text-gray-700 font-semibold">Cédula Empresa</label>
  <input
    type="text"
    name="cedula_empresa"
    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
    value={formData.cedula_empresa}
    readOnly
  />
</div>

<div>
  <label className="block text-gray-700 font-semibold">Empresa</label>
  <input
    type="text"
    name="empresa"
    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
    value={formData.empresa}
    readOnly
  />
</div>

              <div className="mb-2">
                <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Rol
                </label>
                <select
                  id="role"
                  name="role" // Asegúrate de incluir el atributo name
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700 block w-full p-2.5"
                  value={formData.role}
                  onChange={handleChange}
                  required>
                  <option value="">Seleccione un rol</option> {/* Opción para seleccionar un rol */}
                  <option value="admin">Administrador</option>
                  <option value="contador">Contador</option>
                  <option value="empleado">Empleado</option>
                </select>
              </div>

              {!editingUsuario && (
                <>
                  <div>
                    <label className="block text-gray-700 font-semibold">Contraseña</label>
                    <input
                      type="password"
                      name="password"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold">Confirmar Contraseña</label>
                    <input
                      type="password"
                      name="password_confirmation"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      required
                    />
                    {errors.password_confirmation && <p className="text-pink-700">{errors.password_confirmation}</p>}
                  </div>
                </>
              )}
              <button
                type="submit"
                className="w-full mt-4 font-medium text-white bg-sky-900  hover:bg-indigo-900 focus:ring-4 focus:outline-none focus:ring-blue-200 p-2 rounded-md shadow-sm "
              >
                {editingUsuario ? 'Actualizar Usuario' : 'Registrar Usuario'}
              </button>
            </form>

            <h2 className="text-xl font-bold mt-8">Usuarios Registrados</h2>
            <table className="min-w-full mt-4">
              <thead>
                <tr>
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Nombre</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Rol</th>
                  <th className="border px-4 py-2">ID de empresa</th>
                  <th className="border px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(usuario => (
                  <tr key={usuario.id}>
                    <td className="border px-4 py-2">{usuario.id}</td>
                    <td className="border px-6 py-2">{usuario.nombre}</td>
                    <td className="border px-6 py-2">{usuario.email}</td>
                    <td className="border px-3 py-2">{usuario.role}</td>
                    <td className="border px-1 py-2">
                      <button
                        onClick={() => handleEdit(usuario)}
                        className="text-sm text-center font-medium mt-1 px-6 py-1 rounded-xl bg-gray-50 text-gray-600 hover:bg-slate-200 hover:text-sky-800 transition duration-200">
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(usuario.id)}
                        className="text-sm text-center font-medium mt-1 px-6 py-1 rounded-xl gap-2 bg-gray-50 text-gray-600 hover:bg-slate-200 hover:text-sky-800 transition duration-200">
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
      <Footer />
    </>
  );
}
