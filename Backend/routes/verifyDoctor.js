const User = require('../model/User');

module.exports = (req, res, next) => {
    if(!req.user) return res.status(401).send('Doctor Only Route');

    if(User.findOne({ _id: req.user }).isVerifiedDoctor) {
        next();
    } else {
        res.status(401).send('Doctor Only Route');
    }
}