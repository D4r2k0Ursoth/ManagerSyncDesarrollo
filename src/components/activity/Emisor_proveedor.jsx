import React, { useState, useEffect } from 'react';

export function Emisor({ onChange }) {
  const [formEmisorData, setFormEmisorData] = useState({
    identificacion: "",
    tipoIdentificacion: "Cédula Física",
    telefono: "",
    nombre: "",
    correoElectronico: "",
    direccionExacta: "",
    provincia: "No aplica",
    canton: "No aplica",
    distrito: "No aplica",
    barrio: "No aplica",
  });

  const [provincias, setProvincias] = useState([]);
  const [cantonesData, setCantonesData] = useState({});
  const [cantones, setCantones] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [errors, setErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchProvinciasCantonesDistritos = async () => {
      try {
        const response = await fetch(
          'https://services.arcgis.com/LjCtRQt1uf8M6LGR/arcgis/rest/services/Distritos_CR/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json'
        );
        const data = await response.json();
        const dataFormatted = data.features.reduce((acc, item) => {
          const { NOM_PROV, NOM_CANT, NOM_DIST } = item.attributes;
          if (!acc[NOM_PROV]) acc[NOM_PROV] = {};
          if (!acc[NOM_PROV][NOM_CANT]) acc[NOM_PROV][NOM_CANT] = [];
          acc[NOM_PROV][NOM_CANT].push(NOM_DIST);
          return acc;
        }, {});

        setProvincias(Object.keys(dataFormatted));
        setCantonesData(dataFormatted);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchProvinciasCantonesDistritos();
  }, []);

  const handleEmisorChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formEmisorData, [name]: value };
    setFormEmisorData(updatedData);

    if (name === "provincia") {
      setCantones(Object.keys(cantonesData[value] || {}));
      setDistritos([]);
    }

    if (name === "canton") {
      setDistritos(cantonesData[formEmisorData.provincia]?.[value] || []);
    }
  };

  // Validar correo electrónico
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validar formulario
  const validateForm = () => {
    let formErrors = {};
    if (!formEmisorData.identificacion) formErrors.identificacion = "Campo obligatorio";
    if (!formEmisorData.telefono) formErrors.telefono = "Campo obligatorio";
    if (!formEmisorData.nombre) formErrors.nombre = "Campo obligatorio";
    if (!formEmisorData.correoElectronico) {
      formErrors.correoElectronico = "Campo obligatorio";
    } else if (!validateEmail(formEmisorData.correoElectronico)) {
      formErrors.correoElectronico = "Correo electrónico inválido";
    }
    if (!formEmisorData.direccionExacta) formErrors.direccionExacta = "Campo obligatorio";
    
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleAgregar = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onChange(formEmisorData);

      setShowSuccessMessage(true); // Mostrar mensaje de éxito

      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Emisor</h3>

      {/* Mostrar mensaje de éxito */}
      {showSuccessMessage && (
        <div className="bg-sky-100 border border-sky-400 text-sky-700 px-4 py-3 rounded relative lg:mb-4 mb-10" role="alert">
          <strong className="font-bold">¡Datos del emisor agregados correctamente!</strong>
        </div>
      )}

      <form>
        <div className="grid grid-cols-2 gap-4">
          {/* Identificación */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Identificación:</label>
            <input
              type="text"
              name="identificacion"
              value={formEmisorData.identificacion}
              onChange={handleEmisorChange}
              className={`w-full border-2 rounded-lg p-2 focus:outline-none ${errors.identificacion ? 'border-red-500' : 'border-gray-300'} focus:border-sky-600`}
            />
            {errors.identificacion && <p className="text-pink-700 text-sm">{errors.identificacion}</p>}
          </div>

          {/* Tipo de Identificación */}
          <div>
            <label className="block text-gray-700 font-bold mb-2 lg:mt-0 -mt-6">Tipo Identificación:</label>
            <select
              name="tipoIdentificacion"
              value={formEmisorData.tipoIdentificacion}
              onChange={handleEmisorChange}
              className="w-full border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-sky-600"
            >
              <option value="Cédula Física">Cédula Física</option>
              <option value="Cédula Jurídica">Cédula Jurídica</option>
              <option value="DIMEX">DIMEX</option>
              <option value="NITE">NITE</option>
            </select>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Teléfono:</label>
            <input
              type="text"
              name="telefono"
              value={formEmisorData.telefono}
              onChange={handleEmisorChange}
              className={`w-full border-2 rounded-lg p-2 focus:outline-none ${errors.telefono ? 'border-red-500' : 'border-gray-300'} focus:border-sky-600`}
            />
            {errors.telefono && <p className="text-pink-700 text-sm">{errors.telefono}</p>}
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={formEmisorData.nombre}
              onChange={handleEmisorChange}
              className={`w-full border-2 rounded-lg p-2 focus:outline-none ${errors.nombre ? 'border-red-500' : 'border-gray-300'} focus:border-sky-600`}
            />
            {errors.nombre && <p className="text-pink-700 text-sm">{errors.nombre}</p>}
          </div>

          {/* Correo Electrónico */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">Correo Electrónico:</label>
            <input
              type="email"
              name="correoElectronico"
              value={formEmisorData.correoElectronico}
              onChange={handleEmisorChange}
              className={`w-full border-2 rounded-lg p-2 focus:outline-none ${errors.correoElectronico ? 'border-red-500' : 'border-gray-300'} focus:border-sky-600`}
            />
            {errors.correoElectronico && <p className="text-pink-700 text-sm">{errors.correoElectronico}</p>}
          </div>

          {/* Dirección Exacta */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-2">Dirección Exacta:</label>
            <input
              type="text"
              name="direccionExacta"
              value={formEmisorData.direccionExacta}
              onChange={handleEmisorChange}
              className={`w-full border-2 rounded-lg p-2 focus:outline-none ${errors.direccionExacta ? 'border-red-500' : 'border-gray-300'} focus:border-sky-600`}
            />
            {errors.direccionExacta && <p className="text-pink-700 text-sm">{errors.direccionExacta}</p>}
          </div>

          {/* Provincia */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Provincia:</label>
            <select
              name="provincia"
              value={formEmisorData.provincia}
              onChange={handleEmisorChange}
              className="w-full border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-sky-600"
            >
              <option value="No aplica">No aplica</option>
              {provincias.map((provincia) => (
                <option key={provincia} value={provincia}>{provincia}</option>
              ))}
            </select>
          </div>

          {/* Cantón */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Cantón:</label>
            <select
              name="canton"
              value={formEmisorData.canton}
              onChange={handleEmisorChange}
              className="w-full border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-sky-600"
            >
              <option value="No aplica">No aplica</option>
              {cantones.map((canton) => (
                <option key={canton} value={canton}>{canton}</option>
              ))}
            </select>
          </div>

          {/* Distrito */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Distrito:</label>
            <select
              name="distrito"
              value={formEmisorData.distrito}
              onChange={handleEmisorChange}
              className="w-full border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-sky-600"
            >
              <option value="No aplica">No aplica</option>
              {distritos.map((distrito) => (
                <option key={distrito} value={distrito}>{distrito}</option>
              ))}
            </select>
          </div>

          {/* Barrio */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Barrio:</label>
            <input
              type="text"
              name="barrio"
              value={formEmisorData.barrio}
              onChange={handleEmisorChange}
              className="w-full border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-sky-600"
            />
          </div>
        </div>

        <button
          onClick={handleAgregar}
          className="w-full text-white bg-sky-900 rounded-xl hover:bg-indigo-900 focus:ring-4 focus:outline-none focus:ring-sky-600 font-bold py-2 px-4 mt-6 transition duration-200">
          Agregar
        </button>
      </form>
    </div>
  );
}
