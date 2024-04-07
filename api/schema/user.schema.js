const Joi=require("joi")

module.exports={

    verifyOTP:Joi.object({
      otp      : Joi.string().min(4).required().messages({
        "string.base": `OTP is required`,
        "string.empty": `OTP is required`,
        "any.required": `OTP is required`
      }),
      token: Joi.string().uuid().required().messages({
        "string.base": `Token is required`,
        "string.empty": `Token is required`,
        "any.required": `Token is required`
      }),
      deviceToken: Joi.string().uuid().optional().default(null)
      
    }),

    resedOtpSchema:Joi.object({
      token: Joi.string().uuid().required().messages({
        "string.base": `Token is required`,
        "string.empty": `Token is required`,
        "any.required": `Token is required`
      })
    }),

    signupSchema :Joi.object({
      email      : Joi.string().email().required().messages({
        "string.base": `Email is required`,
        "string.empty": `Email is required`,
        "any.required": `Email is required`
      }).example("123@gmail.com"),
      password  : Joi.string().required().min(8).max(16).example("password between 8-16 character").messages({
        "string.base": `Password is required`,
        "string.empty": `Password should not be empty`,
        "any.required": `password is required`,
        "string.min"  : `Password accepted with minimum 8 characters length`,
        "string.max"  : `Password accepted with maximum 16 characters length`
      }),
      name      : Joi.string().required()
    }),

    loginSchema:Joi.object({
        email      : Joi.string().email().required().messages({
        "string.base": `Email is required`,
        "string.empty": `Email is required`,
        "any.required": `Email is required`
      }).example("123@gmail.com"),
      password  : Joi.string().required().min(8).max(16).example("password between 8-16 character").messages({
        "string.base": `Password is required`,
        "string.empty": `Password should not be empty`,
        "any.required": `password is required`,
        "string.min"  : `Password accepted with minimum 8 characters length`,
        "string.max"  : `Password accepted with maximum 16 characters length`
      }),
    }),

    changePasswordSchema:Joi.object(
      {
        oldPassword : Joi.string().required().min(8).max(16).example("password between 8-16 character").messages({
          "string.base": `Password is required`,
          "string.empty": `Password should not be empty`,
          "any.required": `password is required`,
          "string.min"  : `Password accepted with minimum 8 characters length`,
          "string.max"  : `Password accepted with maximum 16 characters length`
        }),
        newPassword : Joi.string().required().min(8).max(16).example("password between 8-16 character").messages({
          "string.base": `Password is required`,
          "string.empty": `Password should not be empty`,
          "any.required": `password is required`,
          "string.min"  : `Password accepted with minimum 8 characters length`,
          "string.max"  : `Password accepted with maximum 16 characters length`
        }),
    }),

    resetPasswordSchema:Joi.object({
      password:Joi.string().required().example("6f4b6903-1a84").messages({
        "string.base": `Password is required`,
        "string.empty": `Password can not be empty`,
        "any.required": `Password is required`
      })
    }),
    
    updateProfileSchema:Joi.object({
      name:Joi.string().required().example("smith").messages({
        "string.base": `Name is required`,
        "string.empty": `Name can not be empty`,
        "any.required": `Name is required`
      }),
      dob:Joi.string().required().example("1990-01-01").messages({
        "string.base": `DOB is required`,
        "string.empty": `DOB can not be empty`,
        "any.required": `DOB is required`
      }),
      email :Joi.string().email().required().example("1990-01-01").messages({
        "string.base": `Email is required`,
        "string.empty": `Email can not be empty`,
        "any.required": `Email is required`
      }),
      isCompleted: Joi.number().integer().allow(1,0).required().example(1).messages({
        "string.base": `isCompleted is required`,
        "string.empty": `isCompleted can not be empty`,
        "any.required": `isCompleted is required`
      }),
    }),

    sendOtpSchema : Joi.object({
      countryCode : Joi.string().required().example("+91").messages({
        "string.base": `Country Code is required`,
        "string.empty": `Country Code can not be empty`,
        "any.required": `Country Code is required`
      }),
      phone : Joi.number().integer().min(5).required().example(12541253).messages({
        "string.base": `Phone number is required`,
        "string.empty": `Phone number can not be empty`,
        "any.required": `Phone number is required`
      })
    })
}