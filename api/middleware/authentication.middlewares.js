const { validateToken, decryptData } = require("../../helper");
const errorMessages = require('../../config/errorMessages.json')
const Models = require("../models");
const appConstant = require("../../appConstant");
const authentication = async (req, res, next) => {
  try {
    let authorization = req.headers.authorization;
    if (!authorization) {
      return res
        .status(401)
        .send({ display: true, success: false, message: "UNAUTHORIZED_REQUEST", response: {} });
    }
    let token = authorization.split(" ");
    let valid = await validateToken(token[1]);
    if (!valid)
      return res
        .status(appConstant.STATUS_CODE.BAD_REQUEST)
        .send({ status: false, message: "INVALID_TOKEN_FORMAT", response: {} });
    let user = await Models.User.findOne({
      where: { id: valid.id },
      include: [{ model: Models.UserProfile, as: "profile" }],
      raw: true,
      nest: true
    });

    if (!user)
      return res
        .status(appConstant.STATUS_CODE.BAD_REQUEST)
        .send({
          display: true, 
          success: false,
          message: "User account not exist",
          response: {},
        });
    if (user.isTokenExpire === appConstant.USER_ACCOUNT_STATUS.TOKEN_EXPIRED)
      return res
        .status(appConstant.STATUS_CODE.BAD_REQUEST)
        .send({
          display: true, 
          success: false,
          message: "Session expired please login again",
          response: {},
        });
    else if (user.status === appConstant.USER_ACCOUNT_STATUS.ACCOUNT_DEACTIVATED)
      return res
        .status(appConstant.STATUS_CODE.BAD_REQUEST)
        .send({
          display: true, 
          success: false,
          message: "Your account has been deactivated",
          response: {},
        });
    else if (user.status === appConstant.USER_ACCOUNT_STATUS.ACCOUNT_DEACTIVATED_BY_ADMIN)
      return res
        .status(appConstant.STATUS_CODE.BAD_REQUEST)
        .send({
          display: true, 
          success: false,
          message: "Account is locked by administrator",
          response: {},
        });

    
    req.auth = {
      scope: valid.scope,
      userId: valid.id,
      user: user,
    };
    next();
  } catch (error) {
    console.log("error ", error);
    return res
      .status(appConstant.STATUS_CODE.SERVER_ERROR)
      .send({  display: true, success: false, message: errorMessages.somethingWentWrong, response: {} });
  }
};
module.exports = { authentication };
