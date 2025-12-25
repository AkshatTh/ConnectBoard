import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MiniCanvas from './Board';
import Home from './Home';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/room/:roomId" element={<Board />} />
            </Routes>
        </Router>
    );
};

export default App;