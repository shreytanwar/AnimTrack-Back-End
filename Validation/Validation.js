//VALIDATION
const Joi = require('@hapi/joi')

//REGISTER
const registerValidation = (data) =>{

    const registerSchema = Joi.object({
        name: Joi.string()
                .min(6)
                .required(),
        email: Joi.string()
                .min(6)
                .required()
                .email(),
        password: Joi.string()
                .min(6)
                .required()
    }).options({ allowUnknown: true })
        
    return registerSchema.validate(data)
    // if(error) return res.status(400).send(error.details[0].message)
}

const loginValidation = (data) =>{

    const loginSchema = Joi.object({
        email: Joi.string()
                .min(6)
                .required()
                .email(),
        password: Joi.string()
                .min(6)
                .required()
    })
        
    return loginSchema.validate(data)
    // if(error) return res.status(400).send(error.details[0].message)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation