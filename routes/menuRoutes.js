
const express = require('express');
const route = express.Router();
const MenuItems = require('./../model/Menue'); 
route.post('/', async (req, res) => {
    try {
        const data = req.body;
        const newMenu = new MenuItems(data);
        const response = await newMenu.save();
        console.log('Menu data saved');
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

route.get('/', async (req, res) => {
    try {
        const data = await MenuItems.find();
        console.log('Menu data fetched');
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = route;