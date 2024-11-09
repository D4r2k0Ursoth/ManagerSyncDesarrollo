import { useState, useEffect } from 'react';

export function CabysModal({ isOpen, onClose, cabysData, onCabysSelect }) {
  // Hooks iniciales
  const [itemsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para la búsqueda
  const [selectedCategory, setSelectedCategory] = useState(''); // Estado para la categoría seleccionada

  // Función de filtrado sin condicional dentro del hook
  const filteredData = cabysData.filter(item => {
    // Filtro por categoría
    const categoryMatch = selectedCategory
      ? Object.keys(item).some(key =>
          key.startsWith('codigo_cabys_categoria_') && item[key] === selectedCategory
        )
      : true;

    // Filtro por término de búsqueda
    const searchMatch = searchTerm
      ? Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      : true;

    return categoryMatch && searchMatch;
  });

  // Paginación
  const paginatedData = filteredData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < filteredData.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    setCurrentPage(0); 
  }, [selectedCategory, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className=" fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg w-3/4 max-h-full overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Seleccionar Producto CABYS</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-bold text-xl">
            &times;
          </button>
        </div>
        
      <div className='flex flex-row justify-between'>
        {/* Campo de búsqueda */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar productos"
            className="min-w-96  p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filtro por categoría */}
        <div className="mb-4">
          <select
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-600"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Todas las Categorías</option>
            {Array.from({ length: 9 }, (_, i) => (
              <option key={i} value={String(i)}>
                Categoría {i}
              </option>
            ))}
          </select>
        </div>
    </div>
        {/* Listado de productos CABYS filtrado */}
        <div className="grid grid-cols-2 gap-4 overflow-clip overflow-x-hidden overflow-y-visible h-96">
          {paginatedData.map((item, index) => (
            <div key={index} className="border border-gray-300 p-4 rounded-lg">
              {Array.from({ length: 9 }, (_, i) => {
                const categoriaIndex = i + 1;
                const codigoCabys = item[`codigo_cabys_categoria_${categoriaIndex}`];
                const descripcionCabys = item[`descripcion_categoria_${categoriaIndex}`];

                return (
                  <div key={categoriaIndex}>
                    {codigoCabys && (
                      <p>
                        <strong>Código Categoría {categoriaIndex}:</strong> {codigoCabys}
                        <button
                          onClick={() => onCabysSelect(item, categoriaIndex)}
                          className="text-cyan-600 hover:underline ml-2">
                          Seleccionar
                        </button>
                      </p>
                    )}
                    {descripcionCabys && (
                      <p><strong>Descripción:</strong> {descripcionCabys}</p>
                    )}
                    {item.impuesto && (
                      <p className='mb-5'><strong>Impuesto:</strong> {item.impuesto}%</p>
                    )}
                    {item.nota_explicativa && (
                      <p><strong>Nota Explicativa:</strong> {item.nota_explicativa}</p>
                    )}
                    {item.nota_no_explicativa && (
                      <p className='mb-5'><strong>Nota No Explicativa:</strong> {item.nota_no_explicativa}</p>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Controles de paginación */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="text-sm text-center font-medium mt-1 px-6 py-1 rounded-xl bg-gray-50 text-gray-600 hover:bg-slate-200 hover:text-sky-800 transition duration-200">
            Ver Menos
          </button>
          <button
            onClick={handleNextPage}
            disabled={(currentPage + 1) * itemsPerPage >= filteredData.length}
            className="text-sm text-center font-medium mt-1 px-6 py-1 rounded-xl bg-gray-50 text-gray-600 hover:bg-slate-200 hover:text-sky-800 transition duration-200">
            Ver Más
          </button>
        </div>
      </div>
    </div>
  );
}
