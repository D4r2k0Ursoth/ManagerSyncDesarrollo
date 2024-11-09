// useProfileForm.js
import { useState, useEffect } from 'react';

export const useProfileForm = (user) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    cedula: '',
    role: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre,
        email: user.email,
        cedula: user.cedula,
        role: user.role
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return { formData, handleChange };
};
