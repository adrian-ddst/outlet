const express = require('express');

const router = express.Router()
const frontendURL = 'http://localhost:4200';
const allowCORS = 'Access-Control-Allow-Origin';

const categoriesModel = require('../models/categoriesModel');
const clothesModel = require('../models/clothesModel');

module.exports = router;

//Get by ID Method
router.get('/getOne/:id', (req, res) => {
    res.set(allowCORS, frontendURL);
    res.send('Get by ID API')
});

//Update by ID Method
router.patch('/update/:id', (req, res) => {
    res.set(allowCORS, frontendURL);
    res.send('Update by ID API')
});

//Delete by ID Method
router.delete('/delete/:id', (req, res) => {
    res.set(allowCORS, frontendURL);
    res.send('Delete by ID API')
});

//Post Method
router.post('/post', async (req, res) => {
    res.set(allowCORS, frontendURL);
    const data = new clothesModel({
        itemName: req.body.itemName,
        categoryName: req.body.categoryName,
        price: req.body.price,
        currency: req.body.currency
    })
    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Get all Method
router.get('/getAll', async (req, res) => {
    res.set(allowCORS, frontendURL);
    try {
        const data = await clothesModel.find();
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
