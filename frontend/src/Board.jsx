import { io } from 'socket.io-client';
import React, { useRef, useEffect, useState } from 'react';

const MiniCanvas = () => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const socketRef = useRef(null);
    const currentPos = useRef({ x: 0, y: 0 });
    const [color, setColor] = useState('black');
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;

        const ctx = canvas.getContext('2d');

        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';

        contextRef.current = ctx;



        socketRef.current = io('http://localhost:5000');
        socketRef.current.on('load-history', (history) => {
            history.forEach((item) => {
                drawLine(item.x0, item.y0, item.x1, item.y1, item.color, false);
            });
        });
        
        socketRef.current.on('drawing', (data) => {
            drawLine(data.x0, data.y0, data.x1, data.y1, data.color, false);
        });


        socketRef.current.on('clear', () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        })
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
                color,
                true
            );
            currentPos.current.x = offsetX;
            currentPos.current.y = offsetY;
        }
    }

    const drawLine = (x0, y0, x1, y1, strokeColor, emit) => {
        contextRef.current.beginPath();
        contextRef.current.moveTo(x0, y0);
        contextRef.current.lineTo(x1, y1);

        contextRef.current.strokeStyle = strokeColor;
        contextRef.current.lineWidth = 5;

        contextRef.current.stroke();
        contextRef.current.closePath();

        if (!emit) return;

        socketRef.current.emit('drawing', {
            x0, y0, x1, y1,
            color: strokeColor
        });
    };




    return (
        <div>
            <div className="toolbar" style={{ position: 'absolute', top: 20, left: 20, display: 'flex', gap: '10px' }}>
                <button onClick={() => setColor('black')}>Black</button>
                <button onClick={() => setColor('red')}>Red</button>
                <button onClick={() => setColor('green')}>Green</button>
                <button onClick={() => setColor('blue')}>Blue</button>
                <button onClick={() => setColor('white')}>Eraser</button>
                <button onClick={() => socketRef.current.emit('clear')}>Clear Board</button>
            </div>


            <canvas
                ref={canvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
            />
        </div>
    );
}


export default MiniCanvas;