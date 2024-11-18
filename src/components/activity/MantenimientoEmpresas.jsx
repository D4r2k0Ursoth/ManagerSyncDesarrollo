import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Loading } from './Loading.jsx';
import { Header } from '../Header.jsx';
import { Footer } from '../Footer.jsx';
export function MantenimientoEmpresas() {

    
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [cedula_empresa, setCedula_empresa] = useState('');
  const [codigo_actividad, setCodigo_actividad] = useState('');
  const [provincia, setProvincia] = useState('');
  const [canton, setCanton] = useState('');
  const [distrito, setDistrito] = useState('');



  const [provincias, setProvincias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [distritos, setDistritos] = useState([]);
  useEffect(() => {
    // Cargar provincias al montar el componente
    fetch('https://ubicaciones.paginasweb.cr/provincias.json')
      .then((response) => response.json())
      .then((data) => setProvincias(Object.entries(data)))
      .catch((error) => console.error('Error al cargar provincias:', error));
  }, []);

  useEffect(() => {
    if (provincia) {
      // Cargar cantones según la provincia seleccionada
      fetch(`https://ubicaciones.paginasweb.cr/provincia/${provincia}/cantones.json`)
        .then((response) => response.json())
        .then((data) => setCantones(Object.entries(data)))
        .catch((error) => console.error('Error al cargar cantones:', error));
    }
  }, [provincia]);

  useEffect(() => {
    if (canton) {
      // Cargar distritos según el cantón seleccionado
      fetch(`https://ubicaciones.paginasweb.cr/provincia/${provincia}/canton/${canton}/distritos.json`)
        .then((response) => response.json())
        .then((data) => setDistritos(Object.entries(data)))
        .catch((error) => console.error('Error al cargar distritos:', error));
    }
  }, [canton]);

  
  const [descripcion, setDescripcion] = useState('');
  const [otrasSenas, setOtrasSenas] = useState('');
  const [empresa, setEmpresa] = useState('juridica'); // valor inicial para tipo de empresa
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEmpresa, setEditingEmpresa] = useState(null);
  const [cedulaEmpresaStatus, setCedulaEmpresaStatus] = useState(null);
  const [isValidatingCedula, setIsValidatingCedula] = useState(false);
const [empresaData, setEmpresaData] = useState({});
  const fetchEmpresas = () => {

    fetch('https://manaercynbdf-miccs.ondigitalocean.app/api/empresas')

      .then(response => response.json())
      .then(data => {
        setEmpresas(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching empresas:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const verificarCedulaEmpresa = async () => {
    const esFisica = empresa === 'fisica';
    const esJuridica = empresa === 'juridica';
  
    if ((esFisica && cedula_empresa.length !== 9) || (esJuridica && cedula_empresa.length !== 10)) {
      setCedulaEmpresaStatus(null);
      console.log('Cédula inválida según el tipo de empresa');
      return;
    }
  
    console.log('Verificando cédula de empresa:', cedula_empresa);
    setIsValidatingCedula(true);
  
    try {
      const response = await fetch(`https://api.hacienda.go.cr/fe/ae?identificacion=${cedula_empresa}`);
      const data = await response.json();
  
      const estado = data.situacion.estado.toLowerCase();
  
      // Verificar el estado de inscripción
      if (estado === 'no inscrito') {
        setCedulaEmpresaStatus('no inscrito');
      } else if (estado === 'inscrito') {
        setCedulaEmpresaStatus('inscrito');
      } else {
        setCedulaEmpresaStatus(null);
      }
  
      // Guardar los datos adicionales en el estado
      const actividadPrincipal = data.actividades[0]; // Suponiendo que deseas la primera actividad
      setEmpresaData({
        nombre: data.nombre,
        tipoIdentificacion: data.tipoIdentificacion,
        regimen: data.regimen.descripcion,
        moroso: data.situacion.moroso,
        omiso: data.situacion.omiso,
        administracionTributaria: data.situacion.administracionTributaria,
        actividades: data.actividades.map(actividad => ({
          codigo: actividad.codigo,
          descripcion: actividad.descripcion,
          estado: actividad.estado,
          tipo: actividad.tipo
        }))
      });
  
      // Actualiza el nombre, la descripción y el código de actividad en el estado
      setNombre(data.nombre); // Actualiza el estado del nombre
      setDescripcion(actividadPrincipal.descripcion); // Establece la descripción de la actividad
      setCodigo_actividad(actividadPrincipal.codigo); // Establece el código de actividad
  
    } catch (error) {
      console.error('Error al verificar la cédula de empresa:', error);
      setCedulaEmpresaStatus(null);
    } finally {
      setIsValidatingCedula(false);
    }
  };
  
  
  const handleSubmit = (e) => {
    e.preventDefault();

    const tipoEmpresa = empresa; // Renombramos a tipoEmpresa para evitar conflicto

    const empresaData = { 
      nombre, 
      telefono, 
      correo, 
      cedula_empresa, 
      provincia, 
      canton, 
      distrito, 
      descripcion,
      otras_senas: otrasSenas,
      codigo_actividad,
      empresa: tipoEmpresa // Esto se envía al controlador como 'empresa'
    };

    fetch('https://manaercynbdf-miccs.ondigitalocean.app/api/empresas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(empresaData),
    })
      .then(response => response.json())
      .then(data => {
        fetchEmpresas(); 
        setNombre('');
        setTelefono('');
        setCorreo('');
        setCedula_empresa('');
        setProvincia('');
        setCanton('');
        setDistrito('');
        setDescripcion('');
        setCodigo_actividad('');
        setOtrasSenas('');
        setEmpresa('juridica'); // Reiniciar tipo de empresa
        setCedulaEmpresaStatus(null); // Reiniciar estado de cédula
      })
      .catch(error => console.error('Error:', error));
  };

  const handleDelete = (id) => {
    fetch(`https://manaercynbdf-miccs.ondigitalocean.app/api/empresas/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          fetchEmpresas(); 
        } else {
          console.error('Error al eliminar la empresa', response.statusText);
        }
      })
      .catch(error => console.error('Error:', error));
  };

  const handleEdit = (empresa) => {
    setNombre(empresa.nombre);
    setTelefono(empresa.telefono);
    setCorreo(empresa.correo);
    setCedula_empresa(empresa.cedula_empresa);
    setCodigo_actividad(empresa.codigo_actividad);
    setProvincia(empresa.provincia);
    setCanton(empresa.canton);
    setDistrito(empresa.distrito);
    setOtrasSenas(empresa.otras_senas);
    setEmpresa(empresa.tipo_empresa); // Cargar tipo de empresa
    setEditingEmpresa(empresa.id);
    setDescripcion(empresa.descripcion);
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    // Asegúrate de que editingEmpresa contiene un valor válido
    console.log('ID de empresa a actualizar:', editingEmpresa);
    if (!editingEmpresa) {
        console.error('No hay empresa para actualizar');
        return; // Salir si no hay ID
    }
    
    const updatedEmpresa = { 
        nombre, 
        telefono, 
        correo, 
        cedula_empresa, 
        provincia, 
        canton, 
        distrito, 
        otras_senas: otrasSenas, 
        codigo_actividad,
        empresa, 
        descripcion,
    };

    fetch(`https://manaercynbdf-miccs.ondigitalocean.app/api/empresas/${editingEmpresa}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEmpresa),
    })
    .then(response => {
        if (response.ok) {
            fetchEmpresas(); 
            // Reiniciar los campos y estado
            setEditingEmpresa(null);
            // Reinicia otros campos
        } else if (response.status === 404) {
            console.error('Empresa no encontrada. Verifica el ID:', editingEmpresa);
        } else {
            console.error('Error al actualizar la empresa', response.statusText);
        }
    })
    .catch(error => console.error('Error:', error));
};


if (loading) return <div className='duration-700'> <Loading/></div>;

  return (
    <>
    <Header/>
    <div className="bg-slate-300  w-screen flex h-max gap-0">
        <div className="basis-1/4 m-4 h-full"></div>

        <div className="lg:flex gap-7">
        <div className="basis-2/4 lg:w-96 w-10/12 py-2 h-min pt-12 p-6 mt-6  mb-4 lg:-ml-20 bg-white rounded-lg shadow-lg" >
        <h1 className="text-3xl font-bold text-gray-800 mb-6 -mt-2">Registrar Empresas</h1>

            <form onSubmit={editingEmpresa ? handleUpdate : handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold text-base">Nombre</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md mb-0.5 focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold">Teléfono</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md mb-0.5 focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold">Email</label>
                <input
                  type="email"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md mb-0.5 focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold">Tipo de empresa</label>
                <select
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md mb-0.5 focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                >
                  <option value="fisica">Física</option>
                  <option value="juridica">Jurídica</option>
                  <option value="extranjera">Extranjera</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold">Cédula de empresa</label>
                <input
                  type="text"
                  className={`w-full mt-1 p-2 border border-gray-300 rounded-md mb-0.5 focus:outline-none focus:ring-2 focus:ring-sky-700
                    ${cedulaEmpresaStatus === 'inscrito' ? 'border-cyan-600' : cedulaEmpresaStatus === 'no inscrito' ? 'border-pink-700' : ''
                  }`}
                  value={cedula_empresa}
                  onChange={(e) => setCedula_empresa(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={verificarCedulaEmpresa}
                  className="mt-2 font-medium bg-sky-50 text-sky-800 hover:bg-sky-100 text-xs py-1 px-2 rounded"
                  disabled={isValidatingCedula}
                >
                  {isValidatingCedula ? 'Validando...' : 'Validar'}
                </button>
                {cedulaEmpresaStatus === 'inscrito' && <span className="text-cyan-600">✔</span>}
                {cedulaEmpresaStatus === 'no inscrito' && <p className="text-pink-700 mt-1">La cédula no se encuentra inscrita en el sistema de Hacienda.</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold">Código de actividad</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md mb-0.5 focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={codigo_actividad}
                  onChange={(e) => setCodigo_actividad(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold">Provincia</label>
                <select
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
            value={provincia}
            onChange={(e) => setProvincia(e.target.value)}>
            <option value="">Seleccione una provincia</option>
            {provincias.map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold">Cantón</label>
                <select
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
            value={canton}
            onChange={(e) => setCanton(e.target.value)}
            disabled={!provincia}
          >
            <option value="">Seleccione un cantón</option>
            {cantones.map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold">Distrito</label>
                <select
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
            value={distrito}
            onChange={(e) => setDistrito(e.target.value)}
            disabled={!canton}
          >
            <option value="">Seleccione un distrito</option>
            {distritos.map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold">Descripción</label>
                <textarea
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md mb-0.5 focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold">Otras señas</label>
                <textarea
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md mb-0.5 focus:outline-none focus:ring-2 focus:ring-sky-700"
                  value={otrasSenas}
                  onChange={(e) => setOtrasSenas(e.target.value)}
                />
              </div>

              

              <button
                type="submit"
                className="w-full text-sm px-5 py-2.5 text-center font-medium text-white bg-sky-900 rounded-xl hover:bg-indigo-900 focus:ring-4 focus:outline-none focus:ring-blue-200">
                {editingEmpresa ? 'Actualizar empresa' : 'Registrar empresa'}
              </button>

              <button
              type="button"
              onClick={() => navigate("/Registro")}
              className="px-5 my-4 py-2.5 w-full text-sm text-center font-medium rounded-xl bg-gray-50 text-gray-600 hover:bg-slate-200 hover:text-sky-800">
              Volver a registro
            </button>
            </form>
          </div>

          <div className="lg:basis-2/4 lg:max-h-[50rem] py-2 pt-12 p-6  mt-6 h-min mb-4 lg:ml-0 w-10/12 lg:w-full  bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 -mt-4">Empresas registradas</h1>
            <div className="overflow-y-scroll">
            <table className="w-full bg-white shadow-md rounded-lg lg:ml-0 ml-1 lg:mr-2 mr-1 mb-3">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm text-center rounded-xl">
            <tr>
                  <th className="border border-gray-300 px-4 py-2">Nombre</th>
                  <th className="border border-gray-300 px-4 py-2">Cédula</th>
                  <th className="border border-gray-300 px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empresas.map((empresa) => (
                  <tr key={empresa.id}>
                    <td className="border border-gray-300 px-4 py-2">{empresa.nombre}</td>
                    <td className="border border-gray-300 px-4 py-2">{empresa.cedula_empresa}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        className="px-5 my-1 py-1 w-full text-sm text-center font-medium rounded-xl bg-gray-50 text-gray-600 hover:bg-slate-200 hover:text-sky-800"
                        onClick={() => handleEdit(empresa)}>
                        Editar
                      </button>
                      <button
                        className="px-5 mt-1 py-1 w-full text-sm text-center font-medium rounded-xl bg-gray-50 text-gray-600 hover:bg-slate-200 hover:text-sky-800"
                        onClick={() => handleDelete(empresa.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
