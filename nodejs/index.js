require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const cors = require('cors');
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 75 // Limit each IP to X requests
})

const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error);
})

database.once('connected', () => {
    console.log('Database Connected');
})
const app = express();

app.set('trust proxy', 1);
app.use(limiter)

app.use(express.json());
app.use('/api', routes);
app.use(cors());

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`);
});
