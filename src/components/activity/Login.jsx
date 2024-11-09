import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Importar Link para redirección
import { useUser } from '../hooks/UserContext.jsx';
import "../../index.css";
import { Header } from '../Header.jsx';
import { Footer } from '../Footer.jsx';

export function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { setUser, setToken } = useUser(); // Usar el contexto
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://managersyncbdf.test/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.usuario); // Guardar el usuario en el contexto
        setToken(data.token); // Guardar el token en el contexto
        navigate('/Settings');
      } else {
        if (data.message) {
          setErrors({ server: data.message }); 
        } else {
          setErrors({ server: 'Credenciales incorrectas. Por favor intenta de nuevo.' });
        }
      }
    } catch (error) {
      console.error('Error:', error.message);
      setErrors({ server: 'Hubo un problema al intentar iniciar sesión.' });
    }
  };

  return (
    <>
      <Header />
      <div className="bg-slate-300 w-screen max-h-full pb-20">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-bold lg:text-5xl text-4xl text-center py-20">¡Bienvenido(a)!</h1>
          <form className="max-w-56 rounded-xl mx-auto bg-white mb-5 p-3" onSubmit={handleLogin}>
            <div className="mb-5">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-600 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-600 dark:focus:border-blue-500"
                placeholder="name@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Contraseña
              </label>
              
              <input
                type="password"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-600 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-600 dark:focus:border-blue-500"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            {errors.server && <p className="text-pink-700 mb-5 font-semibold text-sm">{errors.server}</p>}
            <div className="flex items-start mb-4 text-center">
              <Link to="/forgotpassword" className="text-sm ml-6 italic text-blue-500 hover:underline "> {/* Cambié a Link */}
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <button
              type="submit"
              className="mt-2 w-full text-sm px-5 py-2.5 text-center font-medium text-white bg-sky-900 rounded-xl hover:bg-indigo-900 focus:ring-4 focus:outline-none focus:ring-blue-200">
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
      <footer className="text-center w-full h-full">
        <Footer />
      </footer>
    </>
  );
} 