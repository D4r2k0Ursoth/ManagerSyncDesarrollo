import { useState } from 'react';

export function CabysModal({ isOpen, onClose, onCabysSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApiData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.hacienda.go.cr/fe/cabys?q=${searchTerm}`);
      if (!response.ok) {
        throw new Error('Error al buscar datos en la API externa');
      }
      const data = await response.json();

      // Log para inspeccionar datos de la API
      console.log('Datos obtenidos de la API:', data);

      setApiData(data.cabys || []);
    } catch (error) {
      setError('Hubo un error al buscar los datos.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 h-[36rem] max-h-screen overflow-auto mt-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Seleccionar CABYS de producto </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-bold text-xl">
            &times;
          </button>
        </div>
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Buscar productos"
            className="flex-1 p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-sky-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}/>
          <button
            onClick={fetchApiData}
            className="px-4 py-2 rounded-r-md border font-medium border-gray-300 text-white bg-sky-900  hover:bg-indigo-900 focus:ring-4 focus:outline-none focus:ring-blue-200" >
            Buscar
          </button>
        </div>
        {loading && <div className="text-center">Cargando...</div>}
        {error && <div className="text-center text-pink-700">{error}</div>}
        {!loading && apiData.length > 0 && (
          <div className="overflow-y-scroll">
            <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm text-center rounded-xl">
            <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Código CABYS</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Descripción</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Categorías</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Impuesto</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {apiData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{item.codigo}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.descripcion}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.categorias?.join(', ') || 'Sin categorías'}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{item.impuesto}%</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        onClick={() =>
                          onCabysSelect({
                            codigo: item.codigo,
                            descripcion: item.descripcion,
                            categoria: item.categorias?.join(', ') || 'Sin categorías',
                            impuesto: item.impuesto || 0,
                          })
                        }
                        className="px-4 py-2 rounded-xl font-medium bg-gray-50 text-gray-600 hover:bg-slate-200 hover:text-sky-800">
                        Seleccionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && !error && apiData.length === 0 && (
          <div className="text-center text-gray-500">No se encontraron resultados.</div>
        )}
      </div>
    </div>
  );
}
