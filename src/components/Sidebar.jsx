import { useState } from "react";
import { Link } from "react-router-dom";
import logoImage from '../assets/logo-reducido.svg';
import controlImage from '../assets/control.svg';
import { useNavigate } from "react-router-dom";
import { useUser } from "./hooks/UserContext";

export function Sidebar({ logout }) {
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/");
    };
    const { isAdmin, isEmpleado } = useUser();

    const Menus = [
        { title: "Ventas", src: "Ventas",  link: "/Punto_venta", roles:["admin", "empleado"] },
        { title: "Compras", src: "Compras", link: "/ConsultarCompras", roles:["admin", "empleado"]  },
        { title: "Reportes", src: "Reportes", roles:["admin", "empleado"] , gap: true },
        { title: "Clientes", src: "Clientes", link: "/MantenimientoClientes", roles:["admin", "empleado"]},
        { title: "Proveedores", src: "Proveedores", link: "/MantenimientoProveedores", roles:["admin"]},
        { title: "Usuarios", src: "usuarios", link: "/mantenimientousuarios", roles:["admin"]},
        { title: "Productos", src: "Productos", link: "/MantenimientoProductos", roles:["admin"]},
        { title: "Inventarios", src: "Inventarios" , link: "/ConsultarProductos", roles:["admin", "empleado"]},
        { title: "Estadísticas", src: "Estadisticas", roles:["admin", "empleado"], link: "/EstadisticasFacturas" },
        { title: "Configuración", src: "Configuracion", link: "/Settings",roles:["admin", "empleado"] ,gap: true},
        { title: "Cerrar sesión", src: "CerrarSesion", roles:["admin", "empleado"] , action: logout},
    ];

    return (
        <div className="flex min-h-dvh max-h-fit w-full h-fit ">
            <div className={`flex-h-grow h-fit ${open ? "lg:w-72  lg:pb-72 w-screen bg-slate-50 pb-[50rem]" : "lg:w-28 w-16 lg:bg-slate-50 lg:pb-[50rem]"}  transition-width lg:bg-slate-50  lg:p-5 lg:pt-10 relative ease-in-out duration-300 lg:duration-150 `}>
            <img
                    src={controlImage}
                    className={`absolute cursor-pointer -right-2 lg:-right-5 top-9  border-slate-100 border-5 rounded-full 
                        ${!open && "rotate-180"} 
                        ${open ? "w-12 -translate-x-10 lg:-translate-x-0" : "w-9 -translate-x-10 lg:-translate-x-0"} 
                        transition duration-300 ease-in-out`}
                    onClick={() => setOpen(!open)}
                    onKeyDown={() => setOpen(!open)}
                    alt="Control"
                />

                <div className="flex gap-x-6 items-center">
                    <img
                        onClick={handleClick}
                        onKeyDown={handleClick}
                        src={logoImage}
                        className={`cursor-pointer duration-500 ${open && "rotate-[360deg]" } 
                        ${open ? "lg:block block lg:w-auto w-36 lg:pl-2" : "lg:block hidden lg:pl-3"}`}                        
                        alt="Logo"
                />

                </div>
                <ul className={`flex-grow pt-6 lg:mb-16 mb-0 transition ease-in-out duration-500 ${open ? "lg:block block" : "lg:block hidden"}`} id="menuOptions">
                    {Menus.map((Menu, index) => (
                        (isAdmin && Menu.roles.includes("admin")) || (isEmpleado && Menu.roles.includes("empleado")) ? (
                        <li
                            key={index}
                            className={`flex lg:text-sm md:text-base text-xl  rounded-md p-2 cursor-pointer py-2 lg:px-3 px-8 my-1 active:slate-200 hover:bg-slate-200 lg:hover:px-1
                                hover:text-indigo-800 font-medium hover:text-bold text-gray-900 items-left gap-x-5 transition ease-in-out
                                ${Menu.gap ? "mt-9" : "mt-2"} ${index === 0 && "bg-light-white"}`}>
                                    <span></span>

                            {Menu.title === "Cerrar sesión" ? (
                                <div
                                onClick={Menu.action} 
                                    className="flex items-center gap-x-4 cursor-pointer transition ease-in-out">
                                    <img src={`./src/assets/${Menu.src}.svg`} alt={Menu.title} />
                                    <span className={`${!open && "hidden"} origin-left lg:duration-500 duration-700 transition ease-in-out`}>{Menu.title}</span>
                                </div>

                            ) : Menu.link ? (
                                    <Link to={Menu.link} className="flex items-center gap-x-4 transition ease-in-out">
                                        <img src={`./src/assets/${Menu.src}.svg`} alt={Menu.title} />
                                        <span className={`${!open && "hidden"} origin-left lg:duration-500 duration-700 transition ease-in-out`}>{Menu.title}</span>
                                    </Link>

                            ) : (
                                <>
                                    <img src={`./src/assets/${Menu.src}.svg`} alt={Menu.title} />
                                    <span className={`${!open && "hidden"} origin-left lg:duration-500 duration-700 transition-all`}>{Menu.title}</span>
                                    
                                </>
                            )}
                        </li>
                        ) : null
                    ))}
                </ul>
            </div>
        </div>
    );
}
