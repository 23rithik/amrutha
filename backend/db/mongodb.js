const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error('MONGO_URI not set in .env file');
    process.exit(1);
}

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to DB');
    })
    .catch((err) => {
        console.error('DB connection error:', err);
    });
