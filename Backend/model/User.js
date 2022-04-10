const mongoose = require('mongoose');

function randId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 2,
        max: 20
    },
    lastName: {
        type: String,
        required: true,
        min: 2,
        max: 20
    },
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    doctors: {
        type: Array,
        default: []
    },
    date: {
        type: Date,
        default: Date.now
    },
    isVerifiedDoctor: { // TODO: check this
        type: Boolean,
        default: false
    },
    appointments: {
        type: Array,
        default: []
    },
    notifications: {
        type: Array,
        default: []
    },
    userKey: {
        type: String,
        default: randId(8)
    }
})

module.exports = mongoose.model('User', userSchema);