const Models = require("../models");
const successMessage  = require('../../config/successMessages.json');
const appConstant = require("../../appConstant");
const {sendServerErrorResponse, sendSucessResponse } = require('./response.controller');

module.exports = {
  add : async (req, res) => {
    const transaction = await Models.sequelize.transaction();
    try {
      const { token } = req.body;
      let userId = req.auth.userId;
      let record = await Models.DeviceToken.create({userId, token, active: 1}, { transaction });
      await transaction.commit();
      return sendSucessResponse(res, successMessage.tokenAddedSuccessfully, record, appConstant.STATUS_CODE.CREATED);
    } catch (error) {
      console.log("Error to add device Tokens", error);
      return sendServerErrorResponse(res, error);
    }
  },


};
