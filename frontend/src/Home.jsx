import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as  uuidv4 } from 'uuid';

const Home = () => {
    const navigate = useNavigate();
    const [ roomId, setRoomId ] = useState('');

    const createPrivateRoom = () => {
        const id = uuidv4();
        navigate (`/room/${ id }`);
    };


    const joinPublicRoom = () => {
        navigate(`/room/public-global-room`);
    }

    const joinRoom = () => {
        if (roomId.trim()) {
            navigate(`/room/${roomId}`);
        }
    };


    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>ConnectBoard</h1>
            
            <div style={{ margin: '20px' }}>
                <button 
                    onClick={joinPublicRoom}
                    style={{ padding: '15px 30px', fontSize: '18px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Join Public Board
                </button>
            </div>

            <hr style={{ width: '50%', margin: '30px auto' }} />

            <h3>Private Rooms</h3>
            <button onClick={createPrivateRoom} style={{ padding: '10px 20px', marginRight: '10px' }}>
                 Create New Room
            </button>
            
            <div style={{ marginTop: '20px' }}>
                <input 
                    type="text" 
                    placeholder="Enter Room ID" 
                    onChange={(e) => setRoomId(e.target.value)}
                    style={{ padding: '10px' }}
                />
                <button onClick={joinRoom} style={{ padding: '10px 20px', marginLeft: '10px' }}>
                    Join
                </button>
            </div>
        </div>
    );
};



export default Home;