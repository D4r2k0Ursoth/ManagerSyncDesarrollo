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
        const response = await fetch('https://manaercynbdf-miccs.ondigitalocean.app/api/empresas'); // Asegúrate de que esta URL sea correcta
        if (!response.ok) {
          throw new Error('Error al cargar las empresas');
        }
        const data = await response.json();
        setEmpresas(data); // Asumimos que la respuesta es un array de empresas
        console.log('Empresas cargadas:', data); // Log de las empresas cargadas
      } catch (error) {
        console.error('Error al obtener empresas:', error);
      }
    };

    fetchEmpresas(); // Llamamos a la función al montar el componente
  }, []);

  const handleChange = (event) => {
    const { id, value, type, files } = event.target;
    console.log(`Cambio en el campo: ${id}, Valor: ${value}`); // Log para ver los cambios
    setFormData({
      ...formData,
      [id]: type === 'file' ? files[0] : value
    });
  };

  const uploadToCloudinary = async (file) => {
    const cloudName = 'dw91gh7jr'; // Reemplazar con tu nombre de Cloudinary
    const uploadPreset = 'imgsmanagersync'; // Reemplazar con tu preset de subida
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
  
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    console.log('Respondiendo de Cloudinary:', response); // Log de la respuesta de Cloudinary
    const data = await response.json();
    const fileName = data.public_id.split('/').pop(); // Extraemos solo el nombre del archivo
    return fileName; // Retornamos el nombre del archivo
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log('Datos del formulario antes de validación:', formData); // Log para ver los datos del formulario

    if (formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: 'Las contraseñas no coinciden' });
      return;
    }

    const formDataToSend = new FormData();

    try {
      // Subir la imagen a Cloudinary si hay una
      let imageName = '';
      if (formData.image) {
        imageName = await uploadToCloudinary(formData.image); // Obtén solo el nombre del archivo
        console.log('Nombre de la imagen subida:', imageName); // Log para el nombre de la imagen subida
      }

      // Añadir los datos del formulario
      for (const key in formData) {
        if (key === 'image') {
          continue; // Evitamos enviar la imagen directamente
        }
        formDataToSend.append(key, formData[key]);
      }

      // Añadimos el nombre de la imagen
      if (imageName) {
        formDataToSend.append('profile_image', imageName);
      }

      console.log('Datos que se van a enviar:', formDataToSend); // Log de los datos que se enviarán

      // Hacer el POST a la ruta de registro
      const response = await fetch('https://manaercynbdf-miccs.ondigitalocean.app/api/register', {
        method: 'POST',
        body: formDataToSend
      });

      console.log('Respuesta de la API:', response); // Log de la respuesta de la API

      if (!response.ok) {
        const data = await response.json();
        console.log('Errores al registrar:', data.errors); // Log de los errores de la API
        setErrors(data.errors || {});
        return;
      }

      setSuccess('Usuario registrado correctamente.');
      setTimeout(() => {
        navigate('/LogIn');
      }, 2000);
    } catch (error) {
      console.error('Error en el submit:', error.message);
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

            <label htmlFor="empresa" className="block mt-4 text-sm font-medium text-pink-700">
              Debe registrar una empresa antes de registrar un usuario
            </label>
            <button
              type="button"
              onClick={() => navigate("/MantenimientoEmpresas")}
              className="mt-4 w-full text-sm px-5 mb-4 py-2.5 text-center font-medium text-white bg-sky-900 rounded-xl hover:bg-indigo-900 focus:ring-4 focus:outline-none focus:ring-blue-200"
            >
              Ir a módulo de Empresas
            </button>

            <div className="mb-2">
              <label htmlFor="nombre" className="block mb-2 ml-0.5 text-sm font-medium text-gray-900">
                Nombre de usuario
              </label>
              <input
                type="text"
                id="nombre"
                className="shadow-sm mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700 block w-full p-2.5"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-2">
              <label htmlFor="email" className="block mb-2 ml-0.5 text-sm font-medium text-gray-900">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                className="shadow-sm mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700 block w-full p-2.5"
                placeholder="Nombre@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-2">
              <label htmlFor="cedula" className="block mb-2 text-sm font-medium text-gray-900">
                Cédula de identidad
              </label>
              <input
                type="text"
                id="cedula"
                className="shadow-sm mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700 block w-full p-2.5"
                placeholder="Cédula"
                value={formData.cedula}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-2">
              <label htmlFor="empresa_id" className="block mb-2 text-sm font-medium text-gray-900">
                Seleccionar Empresa
              </label>
              <select
                id="empresa_id"
                className="shadow-sm mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700 block w-full p-2.5"
                value={formData.empresa_id}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una empresa</option>
                {empresas.map((empresa) => (
                  <option key={empresa.id} value={empresa.id}>{empresa.nombre}</option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                className="shadow-sm mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700 block w-full p-2.5"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-2">
              <label htmlFor="password_confirmation" className="block mb-2 text-sm font-medium text-gray-900">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="password_confirmation"
                className="shadow-sm mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700 block w-full p-2.5"
                placeholder="Confirmar contraseña"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-2">
              <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900">
                Imagen de perfil
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleChange}
                className="mb-5"
              />
            </div>

            <button
              type="submit"
              className="w-full text-sm px-5 py-2.5 text-center font-medium text-white bg-sky-900 rounded-xl hover:bg-indigo-900 focus:ring-4 focus:outline-none focus:ring-blue-200"
            >
              Registrar
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
