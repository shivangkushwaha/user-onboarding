const router = require("express").Router()
const { add } = require("../controller/deviceToken.controller")
const appContant = require("../../appConstant"); 
const { scopeValidator } = require("../middleware/scope.middlewares");
const { authentication } = require("../middleware/authentication.middlewares");
const { validator, queryValidator } = require("../middleware/validator.middlewares");
const { addTokenSchema } = require("../schema/deviceToken.schema");

router.post("/device-token" , validator(addTokenSchema),  authentication, scopeValidator( [ appContant.ROLES.USER, appContant.ROLES.ADMIN ] ) , add)


module.exports = router;