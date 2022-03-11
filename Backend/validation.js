const Joi = require('@hapi/joi');

const registerValidation = data => {
    const schema = {
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        email: Joi.string().min(6).required(),
        password: Joi.string().min(6).required()
    };
    return Joi.validate(data, schema);
};

const loginValidation = data => {
    const schema = {
        email: Joi.string().min(6).required(),
        password: Joi.string().min(6).required()
    };
    return Joi.validate(data, schema);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;