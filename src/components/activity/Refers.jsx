import React, { useState } from 'react';

export function Refers({ onChange }) {
  // Estado para los datos de la referencia del documento
  const [referenciaData, setReferenciaData] = useState({
    tipoDocumento: "Factura electrónica",
    numeroDocumento: "",
    fechaDocumento: "",
    tipoReferencia: "Anula Documento de Referencia",
  });

  // Estado para almacenar todas las referencias agregadas
  const [referencias, setReferencias] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Para mostrar el mensaje de éxito

  // Manejar los cambios en los inputs del formulario
  const handleReferenciaChange = (e) => {
    const { name, value } = e.target;
    setReferenciaData({ ...referenciaData, [name]: value });
  };

  // Manejar el botón de agregar referencia
  const handleAgregarReferencia = (e) => {
    e.preventDefault();

    // Verificar si todos los campos requeridos están completos
    if (!referenciaData.numeroDocumento || !referenciaData.fechaDocumento) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }

    // Agregar la referencia al estado
    const updatedReferencias = [...referencias, referenciaData];
    setReferencias(updatedReferencias);

    // Pasar las referencias actualizadas al componente padre
    onChange(updatedReferencias);

    // Limpiar el formulario
    setReferenciaData({
      tipoDocumento: "Factura electrónica",
      numeroDocumento: "",
      fechaDocumento: "",
      tipoReferencia: "Anula Documento de Referencia",
    });

    // Mostrar el mensaje de éxito
    setShowSuccessMessage(true);

    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Referencias</h3>

      {/* Mostrar mensaje de éxito */}
      {showSuccessMessage && (
        <div className="bg-sky-100 border border-sky-400 text-sky-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">¡Referencia agregada correctamente!</strong>
        </div>
      )}

      {/* Formulario para agregar una referencia */}
      <form onSubmit={handleAgregarReferencia}>
        <div className="grid grid-cols-2 gap-10 mb-4">
          {/* Tipo de Documento */}
          <div>
            <label className="block text-gray-700 font-bold mb-1">Tipo Documento</label>
            <select
              name="tipoDocumento"
              value={referenciaData.tipoDocumento}
              onChange={handleReferenciaChange}
              className="w-full border-2 rounded-lg p-2 focus:outline-none border-gray-300 focus:border-sky-600">
              <option value="Factura electrónica">Factura electrónica</option>
              <option value="Tiquete">Tiquete</option>
              <option value="Nota de crédito">Nota de crédito</option>
              <option value="Nota de débito">Nota de débito</option>
            </select>
          </div>

          {/* Número de Documento */}
          <div>
            <label className="block text-gray-700 font-bold mb-1">Número Documento</label>
            <input
              type="text"
              name="numeroDocumento"
              value={referenciaData.numeroDocumento}
              onChange={handleReferenciaChange}
              className="w-full border-2 rounded-lg p-2 focus:outline-none border-gray-300 focus:border-sky-600"
              required
            />
          </div>

          {/* Fecha de Documento */}
          <div>
            <label className="block text-gray-700 font-bold mb-1">Fecha Documento</label>
            <input
              type="date"
              name="fechaDocumento"
              value={referenciaData.fechaDocumento}
              onChange={handleReferenciaChange}
              className="w-full border-2 rounded-lg p-2 focus:outline-none border-gray-300 focus:border-sky-600"
              required
            />
          </div>

          {/* Tipo de Referencia */}
          <div>
            <label className="block text-gray-700 font-bold mb-1">Tipo Referencia</label>
            <select
              name="tipoReferencia"
              value={referenciaData.tipoReferencia}
              onChange={handleReferenciaChange}
              className="w-full border-2 rounded-lg p-2 focus:outline-none border-gray-300 focus:border-sky-600"
            >
              <option value="Anula Documento de Referencia">Anula Documento de Referencia</option>
              <option value="Sustituye Documento de Referencia">Sustituye Documento de Referencia</option>
            </select>
          </div>
        </div>

        {/* Botón para agregar */}
        <button
          type="submit"
          className="w-full text-white bg-sky-900 rounded-xl hover:bg-indigo-900 focus:ring-4 focus:outline-none focus:ring-blue-200 font-bold py-2 px-4 mt-4 mb-12 transition duration-200">
          Agregar
        </button>
      </form>

      {/* Tabla para mostrar las referencias agregadas */}
      {referencias.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-bold mb-4">Referencias Agregadas</h4>
          <table className="lg:table-auto lg:table-cell table-caption lg:w-full w-6/12 border-collapse border border-gray-300 lg:overscroll-x-none overflow-x-scroll">
            <thead>
              <tr className="bg-gray-100 ">
                <th className="border border-gray-300 px-4 py-2">Tipo Documento</th>
                <th className="border border-gray-300 px-4 py-2">Número Documento</th>
                <th className="border border-gray-300 px-4 py-2">Fecha Documento</th>
                <th className="border border-gray-300 px-4 py-2">Tipo Referencia</th>
              </tr>
            </thead>
            <tbody>
              {referencias.map((ref, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{ref.tipoDocumento}</td>
                  <td className="border border-gray-300 px-4 py-2">{ref.numeroDocumento}</td>
                  <td className="border border-gray-300 px-4 py-2">{ref.fechaDocumento}</td>
                  <td className="border border-gray-300 px-4 py-2">{ref.tipoReferencia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {referencias.length === 0 && (
        <div className="mt-4 text-gray-600">No ha seleccionado referencias para el documento</div>
      )}
    </div>
  );
}
