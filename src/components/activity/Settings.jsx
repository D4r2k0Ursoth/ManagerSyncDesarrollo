import React, { useEffect, useState } from 'react';
import { useUser } from '../hooks/UserContext';
import { useProfileForm } from '../hooks/useProfileForm';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { useAccountManagement } from '../hooks/useAccountManagement';
import { Header } from '../Header.jsx';
import { Footer } from '../Footer.jsx';
import { Sidebar } from '../Sidebar.jsx';

import "../../index.css";

export function Settings() {
  const { user, setUser, token, setToken } = useUser();
  const [profileImage, setProfileImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // URL base de Cloudinary
  const cloudinaryBaseUrl = "https://res.cloudinary.com/dw91gh7jr/image/upload/";

  // Hooks personalizados
  const { formData, handleChange } = useProfileForm(user);
  const { error, success, updateProfile } = useUpdateProfile(token, setUser, setToken);
  const { deleteAccount, logout } = useAccountManagement(setUser, setToken);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    await updateProfile(formData, profileImage);
    setEditMode(false);
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar tu cuenta?');
    if (confirmDelete) {
      try {
        await deleteAccount(token); // Aquí se llama a la función para eliminar la cuenta
        logout(); // Cerrar sesión después de eliminar la cuenta
      } catch (error) {
        console.error('Error al eliminar cuenta:', error);
      }
    }
  };

  if (!user) {
    return <div>No hay usuario</div>; // Manejo de usuarios no autenticados
  }

  // Construcción de la URL completa de la imagen de perfil
  const profileImageUrl = user?.profile_image
    ? `${cloudinaryBaseUrl}${user.profile_image.split('/').pop().split('.')[0]}.png`  // Usamos el identificador único de la imagen
    : null;

  return (
    <>
      <Header />
      
      <div className="bg-slate-300 w-screen flex h-max gap-0">
        <div className='basis-1/4 mr-4 h-min items-stretch'>  
          <Sidebar logout={logout} />
        </div>

        <div className="lg:basis-2/4 flex-grow lg:flex-none py-6 px-8 mt-12 w-full bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Configuración de Cuenta</h1>
          
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Nombre</label>
              <input
                type="text"
                name="nombre"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                value={formData.nombre}
                onChange={handleChange}
                required
                disabled={!editMode}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Email</label>
              <input
                type="email"
                name="email"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={!editMode}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Imagen de Perfil</label>
              <input
                type="file"
                name="profile_image"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700"
                onChange={(e) => setProfileImage(e.target.files[0])}
                disabled={!editMode}
              />
              {profileImageUrl && <img src={profileImageUrl} alt="Profile" className="mt-4 w-32 h-32 rounded-full" />}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="w-1/2 mt-4 font-medium text-white bg-sky-900 hover:bg-indigo-900 focus:ring-4 focus:outline-none focus:ring-blue-200 p-2 rounded-md shadow-sm"
                disabled={!editMode}
              >
                Actualizar Perfil
              </button>

              <button
                type="button"
                onClick={() => setEditMode(!editMode)}
                className="w-1/2 mt-4 font-medium text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-blue-200 p-2 rounded-md shadow-sm"
              >
                {editMode ? 'Cancelar' : 'Editar Perfil'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="text-red-600 font-medium text-sm hover:text-red-800"
            >
              Eliminar Cuenta
            </button>

            {showConfirmDelete && (
              <div className="mt-4">
                <p className="text-red-600">¡Advertencia! Esta acción es irreversible.</p>
                <button
                  onClick={handleDeleteAccount}
                  className="mt-4 font-medium text-white bg-red-600 hover:bg-red-800 p-2 rounded-md shadow-sm"
                >
                  Confirmar Eliminación
                </button>
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="ml-4 font-medium text-gray-600 hover:text-gray-800 p-2 rounded-md"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
