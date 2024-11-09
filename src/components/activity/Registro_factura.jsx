import "../../index.css";

import { Header } from '.././Header.jsx';
import { Footer } from '.././Footer.jsx';

export function Registro_factura() {
  
    return (
        <>
            <Header/>
             <div className=" bg-blue-100  w-screen h-max  " >
            <div className="mx-auto py-10 ">
                
          
           
    
             
    
    
      
    
    <div className="relative p-5  overflow-x-auto shadow-md sm:rounded-lg max-w-6xl rounded-xl mx-auto bg-white">
        <h1 className="font-bold text-5xl py-5 ps-24 ">Registro de factura</h1>
     
    
    <form className=" grid grid-cols-3 ps-24 mx-auto">
      <div className="mb-5">
        <label for="id_factura" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ID de factura</label>
        <input type="id_factura" id="id_factura" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-64 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="ID" required />
        <label for="cantidad" className="block mb-2 pt-5 text-sm font-medium text-gray-900 dark:text-white">Cantidad</label>
        <input type="cantidad" id="cantidad" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-64 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Cantidad" required />
     
      </div>
      <div className="mb-5">
        <label for="estado" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Estado</label>
        <input type="estado" id="estado" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-64 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Estado"required />
     
        <label for="cliente" className="block pt-5 mb-2 text-sm font-medium text-gray-900 dark:text-white">Cliente</label>
        <input type="cliente" id="cliente" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-64 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"placeholder="Cliente" required />
      </div>
      <div className="mb-5">
        <label for="fecha" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Identificacion</label>
        <input type="date" id="fecha" name="fecha" 
               class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-64 p-2.5" required />
        <label for="producto" className="block pt-5 mb-2 text-sm font-medium text-gray-900 dark:text-white">Numero de telefono</label>
        <select id="producto" className="bg-gray-50 border border-gray-300  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-64 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">

    <option>Seleccione el producto</option>
    <option>Producto 1</option>
    <option>Producto 2</option>
    <option>Producto 3</option>
  </select>
      
      </div>
      <div className="flex items-start mb-5">
       
       </div>
      
    </form>
    
    
        
        <div className="text-end ">
        <button type="submit" className="m-3  text-white bg-gray-400 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Cancelar</button>
      <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Guardar</button>
      
        </div>
        
    </div>
    
    </div>
    
              </div>
              <Footer/>
        </>
        
      );
} 