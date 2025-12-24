import { io } from 'socket.io-client';
import React, { useRef, useEffect, useState } from 'react';

const MiniCanvas = () => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const socketRef = useRef(null);
    const currentPos = useRef({ x: 0, y: 0 });
    const [currentStroke, setCurrentStroke] = useState([]);
    const [color, setColor] = useState('black');
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;

        const ctx = canvas.getContext('2d');

        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';

        contextRef.current = ctx;



        socketRef.current = io('https://connectboard.onrender.com');

        socketRef.current.emit('join_room', 'default-room');

        socketRef.current.on('load-history', (history) => {
            const ctx = canvas.getContext('2d');

            history.forEach((stroke) =>{
                ctx.strokeStyle = stroke.options.strokeColor;
                ctx.lineWidth = stroke.options.lineWidth;

                ctx.beginPath();

                const firstPoint = stroke.points[0];
                if(firstPoint){
                    ctx.moveTo(firstPoint.x, firstPoint.y);
                    
                    stroke.points.forEach((points) =>{
                        ctx.lineTo(point.x, point.y);
                    });

                    ctx.stroke();
                    ctx.closePath();
                }
            });

            ctx.strokeStyle = color;
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



    const getClientOffset = (event) => {
        
        const { offsetLeft, offsetTop } = event.target;

        if(event.touches) {
            return {
                x: event.touches[0].clientX - offsetLeft,
                y: event.touches[0].clientY - offsetTop,
            };
        }

        else {
            return {
                x: event.nativeEvent.offsetX,
                y: event.nativeEvent.offsetY,
            };
        }
    };


    const startDrawing = (e) => {
        const { x , y } = getClientOffset(e);

        currentPos.current = { x, y };

        setIsDrawing(true);

        setCurrentStroke([{ x, y }]);
    };
    
    
    const draw = (e) => {
        if (!isDrawing) {
            return;
        }
        else {
            const { x, y } = getClientOffset(e);
            drawLine(
                currentPos.current.x,
                currentPos.current.y,
                x,
                y,
                color,
                true
            );
            
            setCurrentStroke((prev) => [...prev, {x, y}]);
            
            currentPos.current = { x, y };
        }
    }
    
    const finishDrawing = () => {
        if (!isDrawing) return;
        else {  
            setIsDrawing(false);    
            contextRef.current.closePath();
            
            if(currentStroke.length > 0) {
                const strokeData = {
                    roomId: 'default-room',
                    options: {
                        strokeColor: color,
                        lineWidth : 5
                    },
                    points : currentStroke
                }

                socketRef.current.emit('save-stroke', strokeData);
            }
            setCurrentStroke([]);
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

                style={{ touchAction:'none' }}

                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                
                onTouchStart={startDrawing}
                onTouchEnd={finishDrawing}
                onTouchMove={draw}
            />
        </div>
    );
}


export default MiniCanvas;