import "../../index.css";
import { ButtonLoadingPage } from './ButtonLoadPage.jsx';
import React, { useState, useEffect } from "react";
import TextTransition, { presets } from 'react-text-transition';

const parrafos = ['Administra tus facturas','Facilita tus trámites', 'Controla tus ganancias','Organiza tus presupuestos']

export function ImgLoadingPage({ image }) {
  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    const intervalId = setInterval(
      () => setIndex((index) => index + 1),
      2500, // every 3 seconds
    );
    return () => clearTimeout(intervalId);
  }, []);

  
  return (
    <div className='relative flex items-center justify-center h-screen'>
      <img className='w-full h-full object-cover' src={image} alt='background' />
      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='text-center'> 
          <div>
                <h1 className='lg:text-7xl text-6xl font-sans font-bold'> Agil. Fácil. Moderno</h1>
          </div>
          <TextTransition className='mt-10 p-10 font-sans text-3xl flex justify-center mb-10' 
              springConfig={presets.slow}>{parrafos[index % parrafos.length]}
              </TextTransition>
              <div className="m-10 pt-10">
          <ButtonLoadingPage/>

              </div>
        </div>
      </div>
    </div>
  );
};
