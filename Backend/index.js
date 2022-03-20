const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import Routes
const authRoute = require('./routes/auth');
const getEvents = require('./routes/getEvents');

dotenv.config();

// Connect to DB
// mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
//     console.log('Connected to DB!');
// });
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
app.use('/api/user/events', getEvents);

app.listen(3000, () => console.log("API Running!"));