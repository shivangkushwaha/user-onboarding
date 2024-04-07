const appConstant = require("../../appConstant");
const { sendBadResponse } = require("../controller/response.controller")

const validator = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate({...req.body});
    const valid = error == null;
    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map(i => i.message).join(",");
      console.error(`error in Joi validation For Params at ${Date.now()}`, message);
      return sendBadResponse(res, message);
    }
  }
}
const queryValidator= (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate({...req.query});
    const valid = error == null;
    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map(i => i.message).join(",");
      console.error(`error in Joi validation For Params at ${Date.now()}`, message);
      return sendBadResponse(res, message);
    }
  }
}
module.exports = { validator ,queryValidator};