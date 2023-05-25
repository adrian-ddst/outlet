require('dotenv').config();

const express =         require('express');
const mongoose =        require('mongoose');
const routes =          require('./routes/routes');
const cors =            require('cors');
const rateLimit =       require('express-rate-limit');
const cookieParser =    require('cookie-parser');
const session =         require('express-session');

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 75 // Limit each IP to X requests
})

const mongoString = process.env.DATABASE_URL;
const sessionEncodingSecret = process.env.SESSION_ENCODING_SECRET;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error);
})

database.once('connected', () => {
    console.log('Database Connected');
})
const app = express();

// req limiter
app.set('trust proxy', 1);
app.use(limiter)

// session parsing
app.use(cookieParser());
app.use(session({
    secret: sessionEncodingSecret,
    resave: false,
    saveUninitialized: true
}));

// routes and cors
app.use(express.json());
app.use('/api', routes);
app.use(cors());

// subscribe
app.listen(3000, () => {
    console.log(`Server Started at ${3000}`);
});
