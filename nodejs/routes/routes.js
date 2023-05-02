require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const categoriesModel = require('../models/categoriesModel');
const clothesModel = require('../models/clothesModel');
const userModel = require('../models/userModel');

const categories = process.env.CATEGORIES;
const jwtSecret = process.env.JWT_SECRET;

const router = express.Router()
const frontendURL = 'http://localhost:4200';
const allowCORS = 'Access-Control-Allow-Origin';

module.exports = router;

// -----------------------------------------------------------------------------------
// -------------------------------------- JWT ----------------------------------------
// -----------------------------------------------------------------------------------

const isAuthorized = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization) {
        const token = authorization.slice(7, authorization.length); //Bearer XXXXXX, gets the XXXXXX
        jwt.verify(token, jwtSecret, (err, decode) => {
            if (err) {
                res.status(401).send({ message: 'Invalid Token' });
            } else {
                req.user = decode;
                next();
            }
        });
    } else {
        res.status(401).send({ message: 'User does not exist' });
    }
};

const generateJWT = (user) => {
    const email = user.email;
    const token = jwt.sign(
        { user_id: user._id, email },
        process.env.JWT_SECRET,
        {
            expiresIn: "2h",
        }
    );
    return token;
}

const verifyJWT = (token) => {
    let state = {
        ok: false,
        msg: ""
    };
    jwt.verify(token, jwtSecret, (err) => {
        if (err) {
            state.ok = false;
            state.msg = "Bad Token";
        } else {
            state.ok = true;
            state.msg = "ok";
        }
    });
    return state;
}

// -----------------------------------------------------------------------------------
// -------------------------------------- JWT END ------------------------------------
// -----------------------------------------------------------------------------------


// -----------------------------------------------------------------------------------
// -------------------------------------- ROUTES -------------------------------------
// -----------------------------------------------------------------------------------

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
    const { email, password } = req.body;
    console.log("Received request to ['/login'] with credentials USER = ['" + email + "'] and PASS = ['" + password + "'] ...");
    try {
        const user = await userModel.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = generateJWT(user);
            res.status(200).json({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                token: token
            });
        } else {
            res.status(400).json({ message: "Bad Credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/silentAutoLogin', async (req, res) => {
    res.set(allowCORS, frontendURL);
    const token = req.body.token;
    console.log("Received request to ['/silentAutoLogin'] with an existing token ...");
    try {
        const tokenState = verifyJWT(token);
        if (tokenState['ok']) {
            res.status(200).json({});
        } else {
            res.status(401).json(tokenState['msg']);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/register', async (req, res) => {
    res.set(allowCORS, frontendURL);
    console.log("Received request to ['/register'] ...");
    const { firstName, lastName, email, password } = req.body;
    const newUser = new userModel({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: await bcrypt.hash(password, 10),
        role: "ROLE_CUSTOMER"
    });
    try {
        const dataToSave = await newUser.save();
        res.status(200).json(dataToSave)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


// Debug GET route
router.get('/debugGet', async (req, res) => {
    res.set(allowCORS, frontendURL);
    console.log("Received request to ['/debugGet'] ... ");
    try {
        res.status(200).json({ message: "ok" });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Debug POST route
router.post('/debugPost', async (req, res) => {
    res.set(allowCORS, frontendURL);
    console.log("Received request to ['/debugPost'] ... ");
    try {
        res.status(200).json({ message: "ok" });
    } catch (err) {
        res.status(500).json(err);
    }
});

// -----------------------------------------------------------------------------------
// -------------------------------------- ROUTES END ---------------------------------
// -----------------------------------------------------------------------------------
