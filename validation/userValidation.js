const validateinputs = require('joi');

const registervalidate = validateinputs.object({
    usernme: validateinputs.string().min(3).max(10).required()
    .messages({
        'string.base': `"Username" should be a type of 'text'`,
        'string.empty': `"Username" cannot be an empty`,
        'string.min': `"Username" should have a minimum length of {#limit}`,
        'string.max': `"Username" should have a maximum length of {#limit}`,
        'any.required': `"Username" is a required `
    }),

    email: validateinputs.string().email().required()
    .messages({
        'string.email': `"Email" must be a valid email`,
        'string.empty': `"Email" cannot be an empty `,
        'any.required': `"Email" is a required `
    }),

    password: validateinputs.string().min(8).required()
    .messages({
        'string.base': `"Password" should be a type of 'text'`,
        'string.empty': `"Password" cannot be an empty `,
        'string.min': `"Password" should have a minimum length of {#limit}`,
        'any.required': `"Password" is a required `
    })
})

const validateRegister = (data) => {
    return registervalidate.validate(data, { abortEarly: false }); // return all errors at once
};
module.exports = { validateRegister };
