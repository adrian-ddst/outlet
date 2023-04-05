const express = require('express');

const categoriesModel = require('../models/categoriesModel');
const clothesModel = require('../models/clothesModel');

const router = express.Router()
const frontendURL = 'http://localhost:4200';
const allowCORS = 'Access-Control-Allow-Origin';

module.exports = router;

router.post('/post', async (req, res) => {
    res.set(allowCORS, frontendURL);
    res.status(200).json({ response: "POST succeeded" })
})

router.get('/getAll', async (req, res) => {
    res.set(allowCORS, frontendURL);
    res.status(200).json({ response: "GET succeeded" })
});
