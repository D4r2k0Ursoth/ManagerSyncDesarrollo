import React from 'react'
import logoImage from '../../assets/logo-reducido.svg';
export const Loading = () => { 
return (
    <div class="flex items-center justify-center w-full h-full mt-48 flex-col">
        <div class="flex justify-center items-center space-x-1">
        
        <img src={logoImage}
        className=" w-60 h-60 cursor-pointer duration-300  animate-spin"                        
                        alt="Logo"
        />
</div>
        <p className='text-2xl text-gray-500 mt-14 font-semibold italic'>Cargando ...</p>
    </div>
)
}
