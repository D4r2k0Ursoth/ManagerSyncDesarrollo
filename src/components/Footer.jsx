import React from 'react'
import { ReactSVG } from 'react-svg';

export const Footer = () => { 
return (
    <div className='flex flex-col items-center justify-center bg-white max-w-full mx-auto p-6 lg:h-auto h-min'>
    <ReactSVG className='lg:max-w-56 lg:mb-4 w-24' src="src/assets/logo-reducido.svg"/>
    <p className='text-gray-400 text-center'>Copyright DevSync ©2024<br></br> Hecho en Costa Rica ♡</p>
</div>

)
}
