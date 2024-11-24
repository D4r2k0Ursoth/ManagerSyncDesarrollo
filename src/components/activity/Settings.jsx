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

  if (!user) {
    return <div>No hay usuario</div>; // Manejo de usuarios no autenticados
  }

  // Construcción de la URL completa de la imagen de perfil
  const profileImageUrl = user?.profile_image
    ? `${cloudinaryBaseUrl}${user.profile_image}`
    : null;

  return (
    <>
      <Header />
      
      <div className="bg-slate-300 w-screen flex h-max  gap-0">
        <div className='basis-1/4 mr-4 h-min items-stretch'>  
          <Sidebar logout={logout} />
        </div>

        <div className="lg:basis-2/4 flex-grow lg:flex-none py-2 pt-12 p-6 mx-auto mt-6 mr-14 lg:mr-0 lg:ml-5 mb-4 h-min bg-white rounded-lg shadow-lg">
          <h1 className="font-bold lg:text-5xl lg:p-10 p-5 text-4xl lg:mt-0 -mt-6 lg:text-left text-center">Hola, {user.nombre}</h1>
          <h2 className="font-semibold lg:indent-6 lg:text-2xl text-3xl lg:text-left text-center lg:ml-2 lg:p-2 lg:-mt-9 p-1">Rol: {user.role}</h2>

          <div className="lg:grid lg:grid-cols-2 lg:p-10 lg:mt-0 mt-4 mx-12">
            <div className="relative w-32 h-32 lg:ml-14  overflow-hidden bg-gray-100 rounded-full drop-shadow">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover p-10"
                />
              ) : (
                <svg
                  className="absolute w-36 h-36 text-gray-400 -left-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
            </div>

            <div className="grid grid-cols-2 lg:gap-2 gap-6 py-4 lg:py-2">
              <div className="flex lg:flex-col lg:justify-end ">
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="w-36 lg:py-2.5 py-0.5 px-5 font-medium -ml-10 text-sm font-mediumfocus:outline-none rounded-full border 
                  bg-gray-50 text-gray-600 hover:bg-slate-200 hover:text-sky-800">
                  {editMode ? 'Cancelar' : 'Editar perfil'}
                </button>
              </div>

              <div className="flex lg:flex-col lg:justify-end">
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="w-36 lg:py-2.5 lg:px-5 py-0.5 px-7 text-sm font-medium rounded-full border 
                  bg-gray-50 text-gray-600 hover:bg-slate-200 hover:text-sky-800">
                  Eliminar cuenta
                </button>
              </div>
            </div>
          </div>

          {editMode && (
            <form onSubmit={handleUpdateProfile} className="p-10">
              <div className="lg:grid lg:grid-cols-2 lg:gap-4">
                <div className='mb-6 lg:mb-0'>
                  <label className="block text-gray-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-700"
                    required
                  />
                </div>
                <div className='mb-6 lg:mb-0'>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-700"
                    required
                  />
                </div>
                <div className='mb-6 lg:mb-0'>
                  <label className="block text-gray-700 mb-2">Cédula</label>
                  <input
                    type="text"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-700"
                    required
                  />
                </div>
                <div className='mb-6 lg:mb-0'>
                  <label className="block text-gray-700">Contraseña actual</label>
                  <input
                    type="password"
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-700"
                  />
                </div>
                <div className='mb-6 lg:mb-0'>
                  <label className="block text-gray-700">Nueva contraseña</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-700"
                  />
                </div>
                <div className='mb-6 lg:mb-0'>
                  <label className="block text-gray-700">Confirmar nueva contraseña</label>
                  <input
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-700"
                  />
                </div>
              
                <div>
                  <label className="block text-gray-700 mb-2">Imagen de perfil</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfileImage(e.target.files[0])}
                    className="w-full p-2 rounded lg:ml-0 -ml-4
                      file:lg:mr-4 file:lg:py-2 file:py-1 file:lg:px-4 file:px-2
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                    file:bg-sky-50 file:text-sky-800
                    hover:file:bg-sky-100"
                  />
                </div>
              </div>
              {error && <p className="text-pink-700">{error}</p>}
              {success && <p className="text-cyan-600">{success}</p>}
              <div className="flex lg:justify-end justify-center mt-4">
                <button
                  type="submit"
                  className="px-6 py-2 text-white bg-sky-600 hover:bg-sky-700 rounded-lg">
                  Guardar cambios
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {showConfirmDelete && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-semibold text-xl">¿Estás seguro de eliminar tu cuenta?</h3>
            <div className="mt-4">
              <button
                onClick={deleteAccount}
                className="text-red-600 hover:text-red-800 mr-4"
              >
                Sí, eliminar
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                No, cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
