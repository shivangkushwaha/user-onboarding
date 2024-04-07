const Joi=require("joi")

module.exports = {
    addTokenSchema : Joi.object({
        token : Joi.string().required().example("device-token").messages({
                    "string.base": `Device-token is required`,
                    "string.empty": `Device-token can not be empty`,
                    "any.required": `Device-token is required`
        })
    })
}