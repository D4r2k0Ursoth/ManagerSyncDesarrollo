import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext'; // Asegúrate de importar correctamente

export const useAccountManagement = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useUser(); // Extraer setUser y setToken directamente del contexto

  // Función para eliminar la cuenta
  const deleteAccount = async (token) => {
    try {
      const response = await fetch('https://manaercynbdf-miccs.ondigitalocean.app/api/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la cuenta');
      }

      // Eliminar los datos del usuario
      setUser(null);
      setToken('');
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirigir al login
      navigate('/login');
    } catch (err) {
      console.error(err.message);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return { deleteAccount, logout };
};
