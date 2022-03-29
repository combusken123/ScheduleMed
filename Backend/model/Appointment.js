const mongoose = require('mongoose');

const doctorAppointmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 2,
        max: 25
    },
    patients: {
        type: Array,
        required: true
    },
    location: {
        type: String,
        required: false
    },
    dateandtime: {
        type: Date,
        required: true
    }
});

module.exports = doctorAppointmentSchema;