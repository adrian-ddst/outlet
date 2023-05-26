require('dotenv').config();

const express =         require('express');
const jwt =             require('jsonwebtoken');
const bcrypt =          require('bcryptjs');
const cloudinary =      require('cloudinary').v2;

// Cloudinary Configuration 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const clothesModel = require('../models/clothesModel');
const userModel = require('../models/userModel');

const categories = process.env.CATEGORIES;
const jwtSecret = process.env.JWT_SECRET;
const xsrfSecret = process.env.XSRF_SECRET;

const router = express.Router()
const frontendURL = 'http://localhost:4200';
const allowCORS = 'Access-Control-Allow-Origin';
const XSRFGenericMessage = 'Missing or invalid XSRF Token';
const JWTGenericMessage = 'Missing or invalid JWT Token';

module.exports = router;

// -----------------------------------------------------------------------------------
// -------------------------------------- JWT ----------------------------------------
// -----------------------------------------------------------------------------------

const generateJWT = (user) => {
    const token = jwt.sign(
        { user_id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
        process.env.JWT_SECRET,
        {
            expiresIn: "2h",
        }
    );
    return token;
}

const verifyJWT = (token) => {
    let state = {
        valid: false,
        message: ""
    };
    jwt.verify(token, jwtSecret, (err) => {
        if (err) {
            state.valid = false;
            state.message = JWTGenericMessage;
        } else {
            state.valid = true;
            state.message = "OK";
        }
    });
    return state;
}

// -----------------------------------------------------------------------------------
// -------------------------------------- JWT END ------------------------------------
// -----------------------------------------------------------------------------------

// -----------------------------------------------------------------------------------
// --------------------------------- XSRF PROTECTION ---------------------------------
// -----------------------------------------------------------------------------------

const reqFromSameDomain = async (request) => {
    if (!request || !request?.session?.id || !request?.headers || !request?.headers['x-xsrf-token']) {
        return false;
    }
    if (await bcrypt.compare((request.session.id + '.' + xsrfSecret), request.headers['x-xsrf-token'])) {
        return true;
    }
}

// -----------------------------------------------------------------------------------
// ------------------------------  XSRF PROTECTION END -------------------------------
// -----------------------------------------------------------------------------------


// -----------------------------------------------------------------------------------
// -------------------------------------- ROUTES -------------------------------------
// -----------------------------------------------------------------------------------

router.get('/get-XSRF-token', async (req, res) => {
    res.set(allowCORS, frontendURL);
    console.log("Received request to ['/get-XSRF-token'] ... ");
    try {
        let xsrf = await bcrypt.hash(req.session.id + '.' + xsrfSecret, 10);
        res.cookie('XSRF-TOKEN', xsrf);
        res.status(200).json({});
    } catch (err) {
        res.status(500).json(err);
    }
});

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

router.post('/getProductByName', async (req, res) => {
    res.set(allowCORS, frontendURL);
    const productName = req.body.productName;
    console.log("Received request to ['/getProductByName'] ... ");
    try {
        const data = await clothesModel.findOne({ itemName: productName });
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
    console.log("Received request to ['/silentAutoLogin'] with an existing token ...");

    if (reqFromSameDomain(req) === false) {
        res.status(401).json({ message: XSRFGenericMessage});
        return;
    }
    
    const token = req.body.token;
    try {
        const jwtTokenState = verifyJWT(token);
        const userData = jwt.decode(token);
        if (jwtTokenState['valid']) {
            res.status(200).json({
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                token: token
            });
        } else {
            res.status(401).json(jwtTokenState['message']);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/checkUserRole', async (req, res) => {
    res.set(allowCORS, frontendURL);
    const token = req.body.token;
    console.log("Received request to ['/checkUserRole'] ...");
    try {
        const userData = jwt.decode(token);
        res.status(200).json({
            role: userData.role
        })
    } catch (error) {
        res.status(401).json({ message: "Bad Token" });
    }
});

router.post('/checkUserTokenSimple', async (req, res) => {
    res.set(allowCORS, frontendURL);
    const token = req.body.token;
    console.log("Received request to ['/checkUserTokenSimple'] ...");
    try {
        const jwtTokenState = verifyJWT(token);
        if (jwtTokenState['valid']) {
            res.status(200).json({});
        } else {
            res.status(401).json(jwtTokenState['message']);
        }
    } catch (error) {
        res.status(401).json({ message: "Bad Token" });
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

    // test on how to upload images to cloudinary ...
    // *[ imageUrl ] este url-ul imaginii (poate fi blob)
    // *[ {} ] e parametrul "options" al functiei de upload
    // *[ public_id ] este numele imaginii in cloudinary (va trebui sa fie unic)
    // *[ folder ] este numele folderului in care il pune, o sa pastram "outlet-clothes-images"
    // *[ secureUrl ] va fi url-ul la care se gaseste imaginea... va trebui pus in db pe product
    try {
        const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg";
        const upload = cloudinary.uploader.upload(imageUrl, { public_id: "test_flag", folder: "outlet-clothes-images" });
        var secureUrl = '';
        upload.then((data) => {
            if (data?.secure_url) {
                secureUrl = data.secure_url;
                console.log("Image upload was successful ... URL: " + secureUrl);
            }
        }).catch((err) => {
            console.log("Image upload has failed ... error: ", err);
        });;
        res.status(200).json({ message: "ok" });
    } catch (err) {
        res.status(500).json(err);
    }
});

// -----------------------------------------------------------------------------------
// -------------------------------------- ROUTES END ---------------------------------
// -----------------------------------------------------------------------------------
