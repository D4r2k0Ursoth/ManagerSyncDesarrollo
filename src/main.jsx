import React from 'react';
import { createRoot } from 'react-dom/client'; // Importa createRoot desde react-dom/client
import { UserProvider } from './components/hooks/UserContext';

 // Ajusta la ruta según tu estructura
import { RouteMain } from './components/routes/RouteMain'; // Ajusta la ruta según tu estructura

const rootElement = document.getElementById('root'); // Obtén el elemento raíz
const root = createRoot(rootElement); // Crea la raíz con createRoot

root.render(
  <React.StrictMode>
    <UserProvider>
      <RouteMain />
    </UserProvider>
  </React.StrictMode>
);






