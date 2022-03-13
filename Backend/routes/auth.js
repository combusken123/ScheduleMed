const router = require("express").Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');

router.post('/register', async(req, res) => {

    // Validate Data
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // User exists?
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists');

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
    });
    try {
        const savedUser = await user.save();
        res.send({ user: user.id });
    } catch(err) {
        res.status(400).send(err);
        console.log(err);
    }
});

// Login
router.post('/login', async (req, res) => {
    // Validate Data
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // User exists?
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email or Password is incorrect');

    // Correct password?
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Email or Password is incorrect');

    // Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token);
})

module.exports = router;