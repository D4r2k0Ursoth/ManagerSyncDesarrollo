import "../../index.css";

import { Header } from '.././Header.jsx';
import { Footer } from '.././Footer.jsx';


export function Ventas() {
  
  return (
    <>
        <Header/>
        <div className=" bg-blue-100  w-screen h-max  " >
        <div className="mx-auto py-16 ">
      
       

         


  

<div className="relative p-5 overflow-x-auto shadow-md sm:rounded-lg max-w-6xl rounded-xl mx-auto bg-white">
    <h1 className="font-bold text-5xl p-5 ">Consultar Ventas</h1>
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
            <th scope="col" className="px-6 py-3">
                    #
                </th>
                <th scope="col" className="px-6 py-3">
                    Cliente
                </th>
                <th scope="col" className="px-6 py-3">
                   Identificación
                </th>
                <th scope="col" className="px-6 py-3">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3">
                   Cantidad
                </th>
                <th scope="col" className="px-6 py-3">
                    Estado
                </th>
                <th scope="col" className="px-6 py-3">
                    Id Factura
                </th>
                <th scope="col" className="px-6 py-3">
                    Acciones
                </th>
            </tr>
        </thead>
        <tbody>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 ">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                   1234
                </th>
                <td className="px-6 py-4">
                Diego Vargas
                </td>
                <td className="px-6 py-4">
                   33
                </td>
                <td className="px-6 py-4">
                    $2999
                </td>
                <td className="px-6 py-4">
                    15
                </td>
                <td className="px-6 py-4">
                    111
                </td>
                <td className="px-6 py-4">
                    32
                </td>
                <td className="px-6 py-4">
                <a href="#" className="font-medium p-3 text-blue-600 dark:text-blue-500 hover:underline">Editar</a>
                <a href="#" className="font-medium text-red-600 dark:text-blue-500 hover:underline">Eliminar</a>                </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    234
                </th>
                <td className="px-6 py-4">
               José Ramirez
                </td>
                <td className="px-6 py-4">
                  44
                </td>
                <td className="px-6 py-4">
                    $1999
                </td>
                <td className="px-6 py-4">
                    15
                </td>
                <td className="px-6 py-4">
                    32
                </td>
                <td className="px-6 py-4">
                    23
                </td>
                <td className="px-6 py-4">
                <a href="#" className="font-medium p-3 text-blue-600 dark:text-blue-500 hover:underline">Editar</a>
                <a href="#" className="font-medium text-red-600 dark:text-blue-500 hover:underline">Eliminar</a>                </td>
            </tr>
            <tr className="bg-white dark:bg-gray-800">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                   4567
                </th>
                <td className="px-6 py-4">
                Brit Fallas
                </td>
                <td className="px-6 py-4">
                    55
                </td>
                <td className="px-6 py-4">
                    $99
                </td>
                <td className="px-6 py-4">
                    60
                </td>
                <td className="px-6 py-4">
                    45
                </td>
                <td className="px-6 py-4">
                    12
                </td>
                <td className="px-6 py-4 ">
                    <a href="#" className="font-medium p-3 text-blue-600 dark:text-blue-500 hover:underline">Editar</a>
                    <a href="#" className="font-medium text-red-600 dark:text-blue-500 hover:underline">Eliminar</a>
                </td>
            </tr>
        </tbody>
    </table>
    <div className="text-end ">
    <button type="submit" className="m-3  text-white bg-gray-400 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Atras</button>
  
  
    </div>
    
</div>



          </div>

          </div>

          <Footer/>
    </>
    
  );
} 