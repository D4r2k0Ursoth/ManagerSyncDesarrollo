// useAccountManagement.js
import { useNavigate } from 'react-router-dom';

export const useAccountManagement = (setUser, setToken) => {
  const navigate = useNavigate();

  const deleteAccount = async (token) => {
    try {
      const response = await fetch('http://managersyncbdf.test/api/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la cuenta');
      }

      setUser(null);
      setToken('');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      console.error(err.message);
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return { deleteAccount, logout };
};
