require('dotenv').config();

const express = require('express');

const categoriesModel = require('../models/categoriesModel');
const clothesModel = require('../models/clothesModel');

const categories = process.env.CATEGORIES;

const router = express.Router()
const frontendURL = 'http://localhost:4200';
const allowCORS = 'Access-Control-Allow-Origin';

module.exports = router;

router.get('/getCategories', async (req, res) => {
    res.set(allowCORS, frontendURL);
    console.log("Received request to ['/getCategories'] ... ");
    try {
        res.status(200).json({ categories: categories });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/getClothes', async (req, res) => {
    res.set(allowCORS, frontendURL);
    console.log("Received request to ['/getClothes'] ... ");
    // req.body va avea filtrele
    try {
        const data = await clothesModel.find();
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    res.set(allowCORS, frontendURL);
    console.log("Received request to ['/login'] with credentials USER = ['" + req.body.email + "'] and PASS = ['" + req.body.password + "'] ...");

    try {
        res.status(200).json({ message: "ok" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
