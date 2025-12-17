const express = require('express');
const PORT = 5000;
const app = express();

app.get('/', (req, res) =>{
    res.send("ConnectBoard Server is Running!");
})

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
})