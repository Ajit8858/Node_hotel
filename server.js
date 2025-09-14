const express = require('express');
const app = express();
const port = 3000;
const db = require('./db');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
app.use(express.json());

// Home route
app.get('/', (req, res) => {
    res.send('Hello World in my village is very beautiful');
});

const personRoute = require('./routes/personRoutes'); 
const menuRoute = require('./routes/menuRoutes');
app.use('/person', personRoute);
app.use('/menu', menuRoute);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
