const router = require("express").Router();
const verify = require('./verifyToken');

router.post('/', verify, (req, res) => {
    let userstuffs = User.findOne({ _id: req.user });
    res.send(userstuffs.events);
});

module.exports = router;