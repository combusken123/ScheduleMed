const router = require("express").Router();
const verify = require('./verifyToken');
const { appointmentValidation } = require('../validation');
const User = require('../model/User');

router.get('/get', verify, (req, res) => {
    let userstuffs = User.findOne({ _id: req.user });
    res.send(userstuffs.appointments);
});

router.post('/make', verify, (req, res) => {
    let user = User.findOne({ _id: req.user });
    
    // Validate Data
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Update user
    user.appointments.push(req.body.appointment);

    try {
        const savedUser = await user.save();
        return res.send("Appointment created succesfully!");
    } catch(err) {
        console.log(err);
        return res.status(500).send(err);
    }
})

module.exports = router;