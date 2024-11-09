// src/components/BackgroundAnimation.jsx

import React, { useEffect, useRef, useState } from 'react';

export function BackgroundAnimation() {
    const canvasRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    let timer;

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Ajustar el tamaño del canvas según la resolución del dispositivo
        const resizeCanvas = () => {
            canvas.width = window.innerWidth * window.devicePixelRatio;
            canvas.height = window.innerHeight * window.devicePixelRatio;
            context.scale(window.devicePixelRatio, window.devicePixelRatio); // Escalar el contexto
        };

        resizeCanvas();

        const balls = [];
        const numBalls = 30;

        for (let i = 0; i < numBalls; i++) {
            balls.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 5 + 2,
                dx: Math.random() * 2 - 1,
                dy: Math.random() * 2 - 1,
            });
        }

        const draw = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            balls.forEach(ball => {
                context.beginPath();
                context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
                context.fillStyle = 'rgba(138, 164, 196, 0.36)';
                context.fill();
                context.closePath();

                ball.x += ball.dx;
                ball.y += ball.dy;

                if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
                    ball.dx *= -1;
                }
                if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
                    ball.dy *= -1;
                }
            });
            requestAnimationFrame(draw);
        };

        const handleMouseMove = () => {
            setIsVisible(false);
            clearTimeout(timer);
            timer = setTimeout(() => {
                setIsVisible(true);
            }, 4000); // Cambiar el tiempo de espera si es necesario
        };

        const handleKeyDown = () => {
            setIsVisible(false);
            clearTimeout(timer);
            // Si se presiona una tecla, también se ocultan las bolitas
        };

        draw();

        // Manejar el redimensionamiento de la ventana
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('keydown', handleKeyDown);

        // Iniciar el temporizador para mostrar las bolitas
        timer = setTimeout(() => {
            setIsVisible(true);
        }, 2000); // Cambiar el tiempo de espera si es necesario

        return () => {
            cancelAnimationFrame(draw);
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('keydown', handleKeyDown);
            clearTimeout(timer);
        };
    }, []);

    return (
        <div className={`fixed top-0 left-0 w-full h-full z-50 pointer-events-none ${isVisible ? '' : 'hidden'}`}>
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
}
