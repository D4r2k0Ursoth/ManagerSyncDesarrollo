import { useState, useEffect } from 'react';
import { Header } from '../Header.jsx';
import { Footer } from '../Footer.jsx';
import { useAccountManagement } from '../hooks/useAccountManagement';
import { Sidebar } from '../Sidebar.jsx';
import { useUser } from '../hooks/UserContext';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Loading } from './Loading.jsx';


// Registra las escalas y elementos que necesitas
Chart.register(CategoryScale, LinearScale, BarElement, Title);

export function EstadisticasFacturas() {
  const { user } = useUser();
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalFactura, setTotalFactura] = useState(0);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null); // Estado para la factura seleccionada
  const { logout } = useAccountManagement();

  const fetchFacturas = () => {
    fetch('https://manaercynbdf-miccs.ondigitalocean.app/api/facturas')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la red');
        }
        return response.json();
      })
      .then(data => {
        // Filtrar las facturas por empresa_id
        const facturasFiltradas = data.filter(factura => factura.empresa_id === user.empresa_id);

        // Asegúrate de que los totales son números
        const updatedData = facturasFiltradas.map(factura => ({
          ...factura,
          total: parseFloat(factura.total),
        }));
        setFacturas(updatedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching facturas:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFacturas();
  }, [user.empresa_id]); // Recarga las facturas si cambia el empresa_id

  // Calcula el total de todas las facturas si no hay una seleccionada
  useEffect(() => {
    if (!facturaSeleccionada) {
      const total = facturas.reduce((acc, factura) => acc + factura.total, 0);
      setTotalFactura(total);
    } else {
      setTotalFactura(facturaSeleccionada.total);
    }
  }, [facturas, facturaSeleccionada]);

  if (loading) return <div className='duration-700'> <Loading/></div>;

  // Datos para el gráfico (muestra solo la factura seleccionada si existe)
  const data = {
    labels: facturaSeleccionada ? [`Factura ${facturaSeleccionada.id}`] : facturas.map(factura => `Factura ${factura.id}`),
    datasets: [
      {
        label: 'Total Factura',
        data: facturaSeleccionada ? [facturaSeleccionada.total] : facturas.map(factura => factura.total),
        backgroundColor: 'rgba(203, 213, 225, 0.6)',
      },
    ],
  };

  return (
    <>
      <Header />
      <div className="bg-slate-300 w-screen flex h-max gap-0">
        <div className="basis-1/4 mr-4 h-full">
          <Sidebar logout={logout} />
        </div>

        <div className="flex gap-6">
          {/* Contenido principal */}
          <div className="py-2 lg:w-[35rem] w-11/12 lg:min-w-max lg:max-h-[50rem] h-min pt-12 p-6 mt-6 mb-4 lg:ml-0 mr-4 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Estadísticas de Facturas</h1>
            <p className="text-lg">Total de {facturaSeleccionada ? `la factura ${facturaSeleccionada.id}` : 'facturas'}: ₡{totalFactura.toLocaleString('es-CR')}</p>
            <div className="h-64"> {/* Establecer una altura máxima para el gráfico */}
              <Bar data={data} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="lg:w-[30rem] lg:max-h-[50rem] w-11/12 py-2 mb-2 h-min lg:ml-0  pt-12 p-6  mt-6 pb-12 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Facturas Registradas</h2>
            <div className="max-h-64 overflow-y-auto">
            <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm text-center rounded-xl ">
                  <tr>
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Total</th>
                    <th className="p-3 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {facturas.map((factura) => (
                    <tr key={factura.id} className="border-b border-gray-200">
                      <td className="p-3">{factura.id}</td>
                      <td className="p-3">₡{factura.total.toLocaleString('es-CR')}</td>
                      <td className="p-3">
                        <button
                          onClick={() => setFacturaSeleccionada(factura)} // Selecciona la factura para mostrar
                          className="text-sm text-center font-medium mt-1 w-full px-4 py-1 rounded-xl bg-gray-100 text-gray-600 hover:bg-slate-200 hover:text-sky-800 transition duration-200">
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
              <button
                onClick={() => setFacturaSeleccionada()} // ver todas las facturas
                className="text-sm text-center font-medium mt-6 px-4 py-1 w-full rounded-xl bg-gray-100 text-gray-600 hover:bg-slate-200 hover:text-sky-800 transition duration-200">
                Ver todas las facturas
              </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
