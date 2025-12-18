import { io } from 'socket.io-client';
import React, { useRef, useEffect, useState } from 'react';

const MiniCanvas = () => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const socketRef = useRef(null);
    const currentPos = useRef({ x: 0, y: 0 });

    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;

        const ctx = canvas.getContext('2d');

        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        
        contextRef.current = ctx;
        
        
        
        socketRef.current = io('http://localhost:5000');
        socketRef.current.on('drawing', (data) =>{
            drawLine(data.x0, data.y0, data.x1, data.y1, false);
        });
    }, []);


    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;

        currentPos.current.x = offsetX;
        currentPos.current.y = offsetY;

        setIsDrawing(true);
    };

    const finishDrawing = () => {
        setIsDrawing(false);
        contextRef.current.closePath();
    }


    const draw = ({ nativeEvent }) => {
        if (!isDrawing) {
            return;
        }
        else {
            const { offsetX, offsetY } = nativeEvent;
            drawLine(
                currentPos.current.x,
                currentPos.current.y,
                offsetX,
                offsetY,
                true
            );
            currentPos.current.x = offsetX;
            currentPos.current.y = offsetY;
        }
    }

    const drawLine = (x0, y0, x1, y1, emit) => {

        contextRef.current.beginPath();
        contextRef.current.moveTo(x0, y0);
        contextRef.current.lineTo(x1, y1);
        contextRef.current.stroke();
        contextRef.current.closePath();

        if (!emit) return;

        socketRef.current.emit('drawing', {
            x0, y0, x1, y1
        });
    };




    return <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} onMouseDown={startDrawing} onMouseUp={finishDrawing} onMouseMove={draw} />;
}


export default MiniCanvas;