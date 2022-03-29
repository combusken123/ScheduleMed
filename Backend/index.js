const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import Routes
const authRoute = require('./routes/auth');
const appointmentRoute = require('./routes/appointments');

dotenv.config();

mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true },
    (err) => {
        if(err) console.log(err) 
        else console.log("mongodb is connected");
    }
);

//Middlewares
app.use(express.json());

// Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/user/appointments', appointmentRoute);

app.listen(3000, () => console.log("API Running!"));