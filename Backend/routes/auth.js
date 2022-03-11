const router = require("express").Router();
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');

router.post('/register', async(req, res) => {

    // Validate Data
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // User exists?
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.statusCode(400).send('Email already exists');

    //Hash the password
    const salt = await bcrypt.genSalt(10);

    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    });
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch(err) {
        res.status(400).send(err);
        console.log(err);
    }
});

module.exports = router;