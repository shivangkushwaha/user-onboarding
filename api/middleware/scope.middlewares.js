const Joi = require("joi");
const { sendBadResponse } = require("../controller/response.controller");
const scopeValidator = ( scope = [] ) => {
  return (req, res, next) => {
    if( scope == null || scope.length === 0 )
        return next()
    let isValid = false;
    let userPermissions = req.auth.scope;
    for (const permission of userPermissions) {
        if( scope.includes(permission) ){
                isValid = true
                break;
        }
    }
    if ( isValid ) {
      next();
    } else {
      return sendBadResponse(res,"Premission out of scope", 422);
    }
  }
}



module.exports = { scopeValidator };