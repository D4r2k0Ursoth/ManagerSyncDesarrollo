import React, { useState, useEffect } from 'react';

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // Limpia el intervalo cuando el componente se desmonte
  }, []);

  return (
    <div style={{ color: 'gray', fontSize: '15px' }}>
      {time.toLocaleTimeString()}
    </div>
  );
}
