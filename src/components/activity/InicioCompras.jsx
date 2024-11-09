import React, { useState } from 'react';

export function Inicio({ onChange }) {
  const [formInicioData, setFormInicioData] = useState({
    condicionVenta: "contado",
    moneda: "colones",
    plazo: "",
    tipoCambio: "",
    observacion: "",
    tipoCompra: "deducible",
  });

  const [errors, setErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Para el mensaje de éxito

  const handleInicioChange = (e) => {
    const { name, value } = e.target;
    setFormInicioData({ ...formInicioData, [name]: value });
  };

  const validateForm = () => {
    let formErrors = {};
    
    if (!formInicioData.condicionVenta) formErrors.condicionVenta = "Campo obligatorio";
    if (!formInicioData.moneda) formErrors.moneda = "Campo obligatorio";
    if (!formInicioData.plazo) formErrors.plazo = "Campo obligatorio";
    if (!formInicioData.tipoCambio) formErrors.tipoCambio = "Campo obligatorio";
    if (!formInicioData.observacion) formErrors.observacion = "Campo obligatorio";
    if (!formInicioData.tipoCompra) formErrors.tipoCompra = "Campo obligatorio";
    
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleAgregar = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onChange(formInicioData);  // Pasar los datos al componente padre

      // Mostrar mensaje de éxito
      setShowSuccessMessage(true);

      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Inicio</h3>

      {/* Mostrar mensaje de éxito */}
      {showSuccessMessage && (
        <div className="bg-sky-100 border border-sky-400 text-sky-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">¡Datos de inicio agregados correctamente!</strong>
        </div>
      )}

      <form>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Condición de la Venta:</label>
          <select
            name="condicionVenta"
            value={formInicioData.condicionVenta}
            onChange={handleInicioChange}
            className={`w-full border-2 rounded-lg p-2 focus:outline-none ${errors.condicionVenta ? 'border-pink-700' : 'border-gray-300'} focus:border-sky-600`}
          >
            <option value="contado">Contado</option>
            <option value="credito">Crédito</option>
          </select>
          {errors.condicionVenta && <p className="text-pink-700 text-sm">{errors.condicionVenta}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Moneda:</label>
          <select
            name="moneda"
            value={formInicioData.moneda}
            onChange={handleInicioChange}
            className={`w-full border-2 rounded-lg p-2 focus:outline-none ${errors.moneda ? 'border-pink-700' : 'border-gray-300'} focus:border-sky-600`}
          >
            <option value="colones">₡ Colones</option>
            <option value="dolares">$ Dólares</option>
          </select>
          {errors.moneda && <p className="text-pink-700 text-sm">{errors.moneda}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Plazo:</label>
          <input
            type="number"
            name="plazo"
            value={formInicioData.plazo}
            onChange={handleInicioChange}
            className={`w-full border-2 rounded-lg p-2 focus:outline-none ${errors.plazo ? 'border-pink-700' : 'border-gray-300'} focus:border-sky-600`}
          />
          {errors.plazo && <p className="text-pink-700 text-sm">{errors.plazo}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Tipo de Cambio:</label>
          <input
            type="number"
            name="tipoCambio"
            value={formInicioData.tipoCambio}
            onChange={handleInicioChange}
            className={`w-full border-2 rounded-lg p-2 focus:outline-none ${errors.tipoCambio ? 'border-pink-700' : 'border-gray-300'} focus:border-sky-600`}
          />
          {errors.tipoCambio && <p className="text-pink-700 text-sm">{errors.tipoCambio}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Observación:</label>
          <input
            type="text"
            name="observacion"
            value={formInicioData.observacion}
            onChange={handleInicioChange}
            className={`w-full border-2 rounded-lg p-2 focus:outline-none ${errors.observacion ? 'border-pink-700' : 'border-gray-300'} focus:border-sky-600`}
          />
          {errors.observacion && <p className="text-pink-700 text-sm">{errors.observacion}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Tipo de Compra:</label>
          <select
            name="tipoCompra"
            value={formInicioData.tipoCompra}
            onChange={handleInicioChange}
            className={`w-full border-2 rounded-lg p-2 focus:outline-none ${errors.tipoCompra ? 'border-pink-700' : 'border-gray-300'} focus:border-sky-600`}
          >
            <option value="deducible">Compra Deducible</option>
            <option value="no_deducible">Compra No Deducible</option>
          </select>
          {errors.tipoCompra && <p className="text-pink-700 text-sm">{errors.tipoCompra}</p>}
        </div>

        <button
          onClick={handleAgregar}
          className="w-full text-white bg-sky-900 rounded-xl hover:bg-indigo-900 focus:ring-4 focus:outline-none focus:ring-blue-200 font-bold py-2 px-4 mt-4 transition duration-200">
          Agregar
        </button>
      </form>
    </div>
  );
}
