import React, { useState } from "react";
import "../../index.css";
import { Header } from "../Header.jsx";
import { Footer } from "../Footer.jsx";
import { BackgroundAnimation } from "./Background.jsx";
import { Emisor } from "./Emisor_proveedor.jsx";
import { Exonera } from "./Exonera_compra.jsx";
import { ProdsServs } from "./ProdsServs.jsx";
import { Refers } from "./Refers.jsx";
import { Finalizar } from "./Finalizar_Compra.jsx";
import { Inicio } from "./InicioCompras";
import { useAccountManagement } from "../hooks/useAccountManagement"; 
import { Sidebar } from "../Sidebar.jsx";
import { useNavigate } from "react-router-dom"; 

// Componente principal de Compras
export function Compras() {
  // Estados para almacenar los datos de cada módulo
  const { logout } = useAccountManagement(); 
  const [activeTab, setActiveTab] = useState("inicio");
  const [inicioData, setInicioData] = useState({});
  const [emisorData, setEmisorData] = useState({});
  const [prodsServsData, setProdsServsData] = useState([]);
  const [exoneraData, setExoneraData] = useState({});
  const [refersData, setRefersData] = useState([]);
  const [totales, setTotales] = useState({});


  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleInicioChange = (data) => setInicioData(data);
  const handleEmisorChange = (data) => setEmisorData(data);
  const handleProdsServsChange = (data) => setProdsServsData(data);
  const handleExoneraChange = (data) => setExoneraData(data);
  const handleRefersChange = (data) => setRefersData(data);
  const handleTotalesChange = (data) => setTotales(data);

  return (
    <>
      <Header />
      <div className="bg-slate-300  w-screen flex h-max  gap-0 relative">
      <div className="basis-1/4 mr-4 h-full">
          <Sidebar logout={logout} />
        </div>
        <div className="lg:basis-2/4 py-2 pt-12 mx-auto p-6 pb-14 mt-6 lg:w-full w-9/12 lg:ml-5 -ml-12 mb-4 bg-white rounded-lg shadow-lg h-min">
          <h2 className="lg:text-3xl text-2xl font-bold text-gray-800 mb-6">Crear documento de Compra Manual</h2>
            
          <div className="tabs lg:flex justify-between border-b-2 lg:mb-4 mb-6">
            <button
              onClick={() => handleTabClick("inicio")}
              className={`px-4 py-2 ${
                activeTab === "inicio"
                  ? "border-b-2 bg-slate-50 rounded-lg border-sky-800 text-sky-800 font-bold hover:bg-slate-100"
                  : "text-gray-500"
              }`}>
              Inicio
            </button>
            <button
              onClick={() => handleTabClick("emisor")}
              className={`px-4 py-2 ${
                activeTab === "emisor"
                  ? "border-b-2 bg-slate-50 rounded-lg border-sky-800 text-sky-800 font-bold hover:bg-slate-100"
                  : "text-gray-500"
              }`}>
              Emisor
            </button>
            <button
              onClick={() => handleTabClick("exonera")}
              className={`px-4 py-2 ${
                activeTab === "exonera"
                  ? "border-b-2 bg-slate-50 rounded-lg border-sky-800 text-sky-800 font-bold hover:bg-slate-100"
                  : "text-gray-500"
              }`}>
              Exonera
            </button>
            <button
              onClick={() => handleTabClick("prodsServs")}
              className={`px-4 py-2 ${
                activeTab === "prodsServs"
                  ? "border-b-2 bg-slate-50 rounded-lg border-sky-800 text-sky-800 font-bold hover:bg-slate-100"
                  : "text-gray-500"
              }`}>
              Prods/Servs
            </button>
            <button
              onClick={() => handleTabClick("refers")}
              className={`px-4 py-2 ${
                activeTab === "refers"
                  ? "border-b-2 bg-slate-50 rounded-lg border-sky-800 text-sky-800 font-bold hover:bg-slate-100"
                  : "text-gray-500"
              }`}>
              Refers
            </button>
            <button
              onClick={() => handleTabClick("finalizar")}
              className={`px-4 py-2 ${
                activeTab === "finalizar"
                  ? "border-b-2 bg-slate-50 rounded-lg border-sky-800 text-sky-800 font-bold hover:bg-slate-100"
                  : "text-gray-500"
              }`}>
              Finalizar
            </button>
          </div>

          {/* Condicional de las pestañas */}
          {activeTab === "inicio" && <Inicio onChange={handleInicioChange} />}
          {activeTab === "emisor" && <Emisor onChange={handleEmisorChange} />}
          {activeTab === "exonera" && (
            <Exonera onChange={handleExoneraChange} />
          )}
          {activeTab === "prodsServs" && (
            <ProdsServs onChange={handleProdsServsChange} />
          )}
          {activeTab === "refers" && <Refers onChange={handleRefersChange} />}
          {activeTab === "finalizar" && (
            <Finalizar
              inicioData={inicioData}
              emisorData={emisorData}
              prodsServsData={prodsServsData}
              exoneraData={exoneraData}
              refersData={refersData}
              totales={totales}
              onTotalesChange={handleTotalesChange}
              // Pasa aquí la función para mostrar el modal
              onApplyDocument={() => setShowModal(true)}
            />
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
