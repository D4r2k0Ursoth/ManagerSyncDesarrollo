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

  return (
    <>
      <Header />
      

      <div className="bg-slate-300 w-screen flex h-max  gap-0">


        <div className='basis-1/4 mr-4 h-min items-stretch'>  
          <Sidebar logout={logout} />
        </div>

          <div className="lg:basis-2/4 flex-grow lg:flex-none py-2 pt-12 p-6 mx-auto mt-6 -ml-14 mr-14 lg:mr-0 lg:ml-5 mb-4 h-min bg-white rounded-lg shadow-lg">
            <h1 className="font-bold lg:text-5xl lg:p-10 p-5 text-4xl lg:mt-0 -mt-6 lg:text-left text-center">Hola, {user.nombre}</h1>
            <h2 className="font-semibold lg:indent-6 lg:text-2xl text-3xl lg:text-left text-center lg:ml-2 lg:p-2 lg:-mt-9 p-1">Rol: {user.role}</h2>

            <div className="lg:grid lg:grid-cols-2 lg:p-10 lg:ml-0 ml-16 lg:mt-0 mt-4">
              <div className="relative w-32 h-32 lg:ml-14 -ml-1 overflow-hidden bg-gray-100 rounded-full drop-shadow">
                {user?.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt="Profile"
                    className="w-full h-full object-cover"
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

              <div className="grid grid-cols-2 lg:gap-2 gap-4 py-4 lg:py-2 lg:ml-0 -ml-16">
                <div className="flex lg:flex-col lg:justify-end ">
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="w-36 lg:py-2.5 py-0.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 
                    hover:bg-gray-100 hover:text-indigo-700">
                    {editMode ? 'Cancelar' : 'Editar perfil'}
                  </button>
                </div>

                <div className="flex lg:flex-col lg:justify-end">
                  <button
                    onClick={() => setShowConfirmDelete(true)}
                    className="w-36 lg:py-2.5 py-0.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 
                    hover:bg-gray-100 hover:text-indigo-700">
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
                      className="w-full p-2 border border-gray-300 rounded focus"
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
                      className="w-full p-2 border border-gray-300 rounded"
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
                      className="w-full p-2 border border-gray-300 rounded "
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
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className='mb-6 lg:mb-0'>
                    <label className="block text-gray-700">Nueva contraseña</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className='mb-6 lg:mb-0'>
                    <label className="block text-gray-700">Confirmar nueva contraseña</label>
                    <input
                      type="password"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
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
                    className="lg:py-2 lg:px-4 w-15 lg:w-full  px-5 py-3 text-white bg-sky-900 rounded-full hover:bg-indigo-900">
                      Guardar cambios
                  </button>
                </div>
              </form>
            )}

            {showConfirmDelete && (
              <div className="overscroll-none absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 lg:min-h-screen h-max">
                <div className="bg-white lg:p-5 px-2 py-5 rounded-lg">
                  <h3 className="text-lg">¿Estás seguro de que deseas eliminar tu cuenta?</h3>
                  <div className="flex justify-end mt-4 gap-3">
                    <button
                      className="lg:px-4 px-6 py-2 bg-pink-700 text-white rounded-3xl"
                      onClick={() => deleteAccount(token)}>
                      Eliminar
                    </button>
                    <button
                      className="lg:px-4 px-6 py-2 bg-gray-300 rounded-3xl"
                      onClick={() => setShowConfirmDelete(false)}>
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        
      </div>
      <div className="h-min">
        <Footer />
      </div>
    </>
  );
}
