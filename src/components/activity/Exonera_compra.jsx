import React, { useState } from 'react';

export function Exonera({ onChange }) {
  const [formExoneraData, setFormExoneraData] = useState({
    numeroExoneracion: "",
    fechaEmision: "",
    tipoExoneracion: "Compras autorizadas",
    porcentaje: 0, // Cambiado a número
    nombreInstitucion: "",
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Para mostrar el mensaje de éxito

  // Manejar los cambios en los inputs del formulario
  const handleExoneraChange = (e) => {
    const { name, value } = e.target;
    const updatedData = {
      ...formExoneraData,
      [name]: name === "porcentaje" ? parseFloat(value) : value, // Convertir porcentaje a número
    };
    setFormExoneraData(updatedData);
  };

  // Manejar el botón de agregar exoneración
  const handleAgregarExoneracion = (e) => {
    e.preventDefault();

    // Verificar si todos los campos requeridos están completos
    if (!formExoneraData.numeroExoneracion || !formExoneraData.fechaEmision || !formExoneraData.nombreInstitucion) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }

    // Pasar los datos de exoneración al componente principal
    onChange(formExoneraData);

    // Mostrar el mensaje de éxito
    setShowSuccessMessage(true);

    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);

    // Limpiar el formulario
    setFormExoneraData({
      numeroExoneracion: "",
      fechaEmision: "",
      tipoExoneracion: "Compras autorizadas",
      porcentaje: 0, // Número
      nombreInstitucion: "",
    });
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Exonera</h3>

      {/* Mostrar mensaje de éxito */}
      {showSuccessMessage && (
        <div className="bg-sky-100 border border-sky-400 text-sky-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">¡Datos de exoneración agregados correctamente!</strong>
        </div>
      )}

      <form onSubmit={handleAgregarExoneracion}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Número Doc. Exoneración:</label>
            <input
              type="text"
              name="numeroExoneracion"
              value={formExoneraData.numeroExoneracion}
              onChange={handleExoneraChange}
              className="w-full border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-sky-600"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Fecha de Emisión:</label>
            <input
              type="date"
              name="fechaEmision"
              value={formExoneraData.fechaEmision}
              onChange={handleExoneraChange}
              className="w-full border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-sky-600"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Tipo de Exoneración:</label>
            <select
              name="tipoExoneracion"
              value={formExoneraData.tipoExoneracion}
              onChange={handleExoneraChange}
              className="w-full border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-sky-600"
            >
              <option value="Compras autorizadas">Compras autorizadas</option>
              <option value="Donaciones">Donaciones</option>
              <option value="Entidades públicas">Entidades públicas</option>
              <option value="Organizaciones sin fines de lucro">Organizaciones sin fines de lucro</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2 lg:mt-0 mt-6">Porcentaje:</label>
            <select
              name="porcentaje"
              value={formExoneraData.porcentaje}
              onChange={handleExoneraChange}
              className="w-full border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-sky-600"
            >
              <option value={0}>0%</option>
              <option value={13}>13%</option> {/* Cambiar a número */}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">Nombre Inst. Exoneración:</label>
            <input
              type="text"
              name="nombreInstitucion"
              value={formExoneraData.nombreInstitucion}
              onChange={handleExoneraChange}
              className="w-full border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-sky-600"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full text-white bg-sky-900 rounded-xl hover:bg-indigo-900 focus:ring-4 focus:outline-none focus:ring-blue-200 font-bold py-2 px-4 mt-4 transition duration-200">
          Agregar
        </button>
      </form>
    </div>
  );
}
