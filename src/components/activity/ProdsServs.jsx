import React, { useState } from 'react';

export function ProdsServs({ onChange }) {
  const [productData, setProductData] = useState({
    codigo: "",
    servicio: "Si",
    descripcion: "",
    cantidad: 1,
    precioBruto: "",
    porcentajeDesc: "",
    porcentajeIVA: "",
  });

  const [detalleFactura, setDetalleFactura] = useState([]);
  const [errors, setErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Estado para el mensaje de éxito

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Limpiar el error correspondiente al input modificado
  };

  const handleAgregarProducto = (e) => {
    e.preventDefault();

    const newErrors = {};

    // Validaciones de los campos
    if (!productData.codigo) {
      newErrors.codigo = "El código es obligatorio.";
    }
    if (!productData.descripcion) {
      newErrors.descripcion = "La descripción es obligatoria.";
    }
    if (productData.cantidad <= 0) {
      newErrors.cantidad = "La cantidad debe ser mayor que 0.";
    }
    if (!productData.precioBruto || productData.precioBruto <= 0) {
      newErrors.precioBruto = "El precio bruto es obligatorio y debe ser mayor que 0.";
    }
    if (productData.porcentajeDesc === "" || productData.porcentajeDesc < 0 || productData.porcentajeDesc > 100) {
      newErrors.porcentajeDesc = "El porcentaje de descuento debe estar entre 0 y 100.";
    }
    if (productData.porcentajeIVA === "" || productData.porcentajeIVA < 0 || productData.porcentajeIVA > 100) {
      newErrors.porcentajeIVA = "El porcentaje de IVA debe estar entre 0 y 100.";
    }

    // Si hay errores, se establecen en el estado
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedFactura = [...detalleFactura, productData];
    setDetalleFactura(updatedFactura);
    onChange(updatedFactura);

    // Mostrar mensaje de éxito
    setShowSuccessMessage(true);

    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);

    // Limpiar formulario
    setProductData({
      codigo: "",
      servicio: "Si",
      descripcion: "",
      cantidad: 1,
      precioBruto: "",
      porcentajeDesc: "",
      porcentajeIVA: "",
    });
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Productos/Servicios</h3>

      {/* Mostrar mensaje de éxito */}
      {showSuccessMessage && (
        <div className="bg-sky-100 border border-sky-400 text-sky-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">¡Producto agregado correctamente!</strong>
        </div>
      )}

      <form onSubmit={handleAgregarProducto}>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="col-span-1">
            <label className="block text-gray-700 font-bold mb-1">Código</label>
            <input
              type="text"
              name="codigo"
              value={productData.codigo}
              onChange={handleProductChange}
              className="w-full border-2 rounded-lg p-2 focus:outline-none border-gray-300 focus:border-sky-600"
            />
            {errors.codigo && <p className="text-pink-700 text-sm">{errors.codigo}</p>}
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700 font-bold mb-1">Servicio</label>
            <select
              name="servicio"
              value={productData.servicio}
              onChange={handleProductChange}
              className="w-full border-2 rounded-lg p-2 focus:outline-none border-gray-300 focus:border-sky-600"
            >
              <option value="Si">Si</option>
              <option value="No">No</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-1">Descripción</label>
            <input
              type="text"
              name="descripcion"
              value={productData.descripcion}
              onChange={handleProductChange}
              className="w-full border-2 rounded-lg p-2 focus:outline-none border-gray-300 focus:border-sky-600"
            />
            {errors.descripcion && <p className="text-pink-700 text-sm">{errors.descripcion}</p>}
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700 font-bold mb-1">Cant</label>
            <input
              type="number"
              name="cantidad"
              value={productData.cantidad}
              onChange={handleProductChange}
              className="w-full border-2 rounded-lg p-2 focus:outline-none border-gray-300 focus:border-sky-600"
              min="1"
            />
            {errors.cantidad && <p className="text-pink-700 text-sm">{errors.cantidad}</p>}
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700 font-bold mb-1">Precio Bruto</label>
            <input
              type="number"
              name="precioBruto"
              value={productData.precioBruto}
              onChange={handleProductChange}
              className="w-full border-2 rounded-lg p-2 focus:outline-none border-gray-300 focus:border-sky-600"
              min="0"
            />
            {errors.precioBruto && <p className="text-pink-700 text-sm">{errors.precioBruto}</p>}
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700 font-bold mb-1">%Desc</label>
            <input
              type="number"
              name="porcentajeDesc"
              value={productData.porcentajeDesc}
              onChange={handleProductChange}
              className="w-full border-2 rounded-lg p-2 focus:outline-none border-gray-300 focus:border-sky-600"
              min="0"
              max="100"
            />
            {errors.porcentajeDesc && <p className="text-pink-700 text-sm">{errors.porcentajeDesc}</p>}
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700 font-bold mb-1">%IVA</label>
            <input
              type="number"
              name="porcentajeIVA"
              value={productData.porcentajeIVA}
              onChange={handleProductChange}
              className="w-full border-2 rounded-lg p-2 focus:outline-none border-gray-300 focus:border-sky-600"
              min="0"
              max="100"
            />
            {errors.porcentajeIVA && <p className="text-pink-700 text-sm">{errors.porcentajeIVA}</p>}
          </div>
        </div>

        <button
          type="submit"
          className="w-full text-white bg-sky-900 rounded-xl hover:bg-indigo-900 focus:ring-4 focus:outline-none focus:ring-blue-200 font-bold py-2 px-4 mt-4 transition duration-200">
          Agregar
        </button>
      </form>

      {detalleFactura.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-bold mb-2">Detalle de la Factura</h4>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Código</th>
                <th className="border border-gray-300 px-4 py-2">Servicio</th>
                <th className="border border-gray-300 px-4 py-2">Descripción</th>
                <th className="border border-gray-300 px-4 py-2">Cant</th>
                <th className="border border-gray-300 px-4 py-2">Precio Bruto</th>
                <th className="border border-gray-300 px-4 py-2">%Desc</th>
                <th className="border border-gray-300 px-4 py-2">%IVA</th>
              </tr>
            </thead>
            <tbody>
              {detalleFactura.map((producto, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{producto.codigo}</td>
                  <td className="border border-gray-300 px-4 py-2">{producto.servicio}</td>
                  <td className="border border-gray-300 px-4 py-2">{producto.descripcion}</td>
                  <td className="border border-gray-300 px-4 py-2">{producto.cantidad}</td>
                  <td className="border border-gray-300 px-4 py-2">{producto.precioBruto}</td>
                  <td className="border border-gray-300 px-4 py-2">{producto.porcentajeDesc}</td>
                  <td className="border border-gray-300 px-4 py-2">{producto.porcentajeIVA}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
