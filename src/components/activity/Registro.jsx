import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "../../index.css";
import { Header } from '../Header.jsx';
import { Footer } from '../Footer.jsx';
import { MantenimientoEmpresas } from './MantenimientoEmpresas.jsx';



export function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    cedula: '',
    
    role: 'admin',
   
    password: '',
    password_confirmation: '',
    image: null,
    empresa_id: '' // Nuevo estado para el id de la empresa
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [cedulaEmpresaStatus, setCedulaEmpresaStatus] = useState(null);
  const [isValidatingCedula, setIsValidatingCedula] = useState(false);
 
  const [empresas, setEmpresas] = useState([]); // Estado para las empresas
    
const navigate = useNavigate();

  



  useEffect(() => {
    // Función para obtener las empresas
    const fetchEmpresas = async () => {
      try {
        const response = await fetch('http://managersyncbdf.test/api/empresas'); // Asegúrate de que esta URL sea correcta
        if (!response.ok) {
          throw new Error('Error al cargar las empresas');
        }
        const data = await response.json();
        setEmpresas(data); // Asumimos que la respuesta es un array de empresas
      } catch (error) {
        console.error('Error al obtener empresas:', error);
      }
    };

    fetchEmpresas(); // Llamamos a la función al montar el componente
  }, []);


  
  const handleChange = (event) => {
    const { id, value, type, files } = event.target;
    setFormData({
      ...formData,
      [id]: type === 'file' ? files[0] : value
    });
  };

  

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: 'Las contraseñas no coinciden' });
      return;
    }

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key === 'image' ? 'profile_image' : key, formData[key]);
    }

    try {
      const response = await fetch('http://managersyncbdf.test/api/register', {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        const data = await response.json();
        setErrors(data.errors || {});
        return;
      }

      setSuccess('Usuario registrado correctamente.');
      setTimeout(() => {
        navigate('/LogIn');
      }, 2000);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };



  return (
    <>
    <Header />
    <div className="bg-slate-300 w-screen max-h-full pb-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-bold lg:text-5xl text-4xl text-center py-20">¡Bienvenido(a)!</h1>

          <form className="rounded-xl max-w-56 mx-auto mb-5 bg-white p-3" onSubmit={handleSubmit}>
            {success && <p className="text-cyan-600 mt-2">{success}</p>}

            {errors.email && <p className="text-pink-700">{errors.email[0]}</p>}
            {errors.cedula && <p className="text-pink-700">{errors.cedula[0]}</p>}
            {errors.password_confirmation && <p className="text-pink-700">{errors.password_confirmation}</p>}

            <div className="mb-2">
              <label htmlFor="nombre" className="block mb-2 ml-0.5 text-sm font-medium text-gray-900">
                Nombre de usuario
              </label>
              <input
                type="text"
                id="nombre"
                className="shadow-sm mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-500 focus:border-slate-500 block w-full p-2.5"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-2">
              <label htmlFor="email" className="block mb-2 ml-0.5 text-sm font-medium text-gray-900 dark:text-white">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                className="shadow-sm mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-500 focus:border-slate-500 block w-full p-2.5"
                placeholder="nombre@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-2">
              <label htmlFor="cedula" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Cédula de identidad
              </label>
              <input
                type="text"
                id="cedula"
                className="shadow-sm mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-500 focus:border-slate-500 block w-full p-2.5"
                placeholder="Cédula"
                value={formData.cedula}
                onChange={handleChange}
                required
              />
            </div>


          <label
                htmlFor="empresa"
                className="block mt-4 text-sm font-medium text-red-900"
              >
                Debe registrar una empresa para registrar usuario
              </label>
            <button
              type="button"
              onClick={() => navigate("/MantenimientoEmpresas")}
              className="mt-4 w-full text-sm px-5 mb-4 py-2.5 text-center font-medium text-white bg-sky-900 rounded-xl hover:bg-indigo-900 focus:ring-4 focus:outline-none focus:ring-blue-200"
            >
              Ir a modulo de Empresas
            </button>

<div className="mb-2">
              <label htmlFor="empresa_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Seleccionar Empresa
              </label>
              <select
                id="empresa_id"
                className="shadow-sm mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-500 focus:border-slate-500 block w-full p-2.5"
                value={formData.empresa_id}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una empresa</option>
                {empresas.map(empresa => (
                  <option key={empresa.id} value={empresa.id}>
                    {empresa.nombre} {/* Cambia 'nombre' por el campo que quieras mostrar */}
                  </option>
                ))}
              </select>





    
            </div>






            

            <div className="mb-2">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                className="shadow-sm mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-500 focus:border-slate-500 block w-full p-2.5"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-2">
              <label htmlFor="password_confirmation" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Confirmar contraseña
              </label>
              <input
                type="password"
                id="password_confirmation"
                className="shadow-sm mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-500 focus:border-slate-500 block w-full p-2.5"
                placeholder="Confirmar contraseña"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-2">
              <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Imagen de perfil
              </label>
              <input
                type="file"
                id="profile_image"
                className="shadow-sm mb-5  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                  file:py-2 file:px-4 file:-ml-2
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-sky-50 file:text-sky-800
                  hover:file:bg-sky-100"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full text-sm px-5 py-2.5 text-center font-medium text-white bg-sky-900 rounded-xl hover:bg-indigo-900 focus:ring-4 focus:outline-none focus:ring-blue-200">
              Registrarse
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
