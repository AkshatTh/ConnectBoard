import { io } from 'socket.io-client';
import React, { useRef, useEffect, useState } from 'react';

const MiniCanvas = () => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const socketRef = useRef(null);

    const [ isDrawing, setIsDrawing ] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;

        const ctx = canvas.getContext('2d');

        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        
        contextRef.current = ctx;
        socketRef.current = io('http://localhost:5000');
    }, []);


    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;

        contextRef.current.beginPath();

        contextRef.current.moveTo(offsetX, offsetY);

        setIsDrawing(true);
    };

    const finishDrawing = () => {
        setIsDrawing(false);
        contextRef.current.closePath();
    }


    const draw = ({ nativeEvent }) => {
        if(!isDrawing){
            return ;
        }
        else{ 
            const { offsetX, offsetY } = nativeEvent;

            contextRef.current.lineTo(offsetX, offsetY);
            contextRef.current.stroke();
        }
    }

    return <canvas ref = {canvasRef} width = {window.innerWidth} height = {window.innerHeight} onMouseDown={startDrawing} onMouseUp={finishDrawing} onMouseMove={draw}/>;
}


export default MiniCanvas;