const Joi = require('@hapi/joi');

const registerValidation = data => {
    const schema = Joi.object({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        email: Joi.string().min(6).required(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
};

const loginValidation = data => {
    const schema = Joi.object({
        email: Joi.string().min(6).required(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
};

const appointmentValidation = data => {
    const schema = Joi.object({ 
        title: Joi.string().min(2).required(),
        patients: Joi.array().required(),
        location: Joi.string().min(5),
        dateandtime: Joi.date().required()
    });
    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.appointmentValidation = appointmentValidation;