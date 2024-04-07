const Models = require('../models');
const MD5 = require('md5');
const { generateAccessToken } = require('../../helper');
const helper = require('../../helper');
const { v4: uuidv4 } = require('uuid');
const errorMessages = require('../../config/errorMessages.json');
const successMessages = require('../../config/successMessages.json');
const logger = require('../../utils/winston');
const appConstant = require('../../appConstant');
const {sendServerErrorResponse, sendSucessResponse, sendBadResponse } = require('./response.controller');

module.exports = {
  
  login: async (req, res) => {
    const transaction = await Models.sequelize.transaction();
    try {
      let { email, password } = req.body;
      let user = await Models.User.findOne({
        where: { email },
        attributes: ['id', 'email', 'password'],
        include: [
          {
            model: Models.UserProfile,
            attributes: ['name', 'dob'],
            as: 'profile',
          },
        ],
      });

      if (!user) {
        await transaction.rollback();
        return sendBadResponse(res, errorMessages.invalidCredentials);
      }

      // check if user is locked by admin
      if (user.status == appConstant.USER_ACCOUNT_STATUS.ACCOUNT_DEACTIVATED_BY_ADMIN) {
        await transaction.rollback();
        return sendBadResponse(res, errorMessages.blockedByAdmin);
      }

      // check the password
      if (user.password != MD5(password)) {
        await transaction.rollback();
        return sendBadResponse(res, errorMessages.invalidCredentials);
      }
      await user.update({status: appConstant.STATUS.ACTIVE, isTokenExpire: appConstant.STATUS.INACTIVE}, {transaction});
      await transaction.commit();
      let data = await generateAccessToken(user.id);
      return sendSucessResponse(res, successMessages.loginSuccess, { token: data.token, user: data.user });
    } catch (error) {
      console.log('Error in Sign Up', error);
      await transaction.rollback();
      return sendServerErrorResponse(res, error);
    }
  },

  verifyOtp: async (req, res) => {
    const transaction = await Models.sequelize.transaction();
    try {
      const { otp, token, deviceToken } = req.body;

      /* Checking If Token Exist OR not */
      let record = await Models.Token.findOne({ where: { token } });
      if(record) {

        /* Check if otp is expired for that user or not */
        if( record.dataValues.status !== appConstant.STATUS.ACTIVE ) {
          await transaction.rollback();
          return sendBadResponse(res,errorMessages.otpExpired);
        }

        /* Check If Correct OTP is Provided or Not */
        if( record.dataValues.otp !== otp.toString() ) {
          await transaction.rollback();
          return sendBadResponse(res,errorMessages.invalidOTP);
        }
        /* Check if user is registed with us or not */
        let user = await Models.User.findOne( { where: { phone: record.dataValues.phone, countryCode: record.dataValues.countryCode }});
        if(user) {
          / * assign JWT token to him and say suceessfully logged in * /
          await user.update({ status: appConstant.STATUS.ACTIVE, isTokenExpire: appConstant.STATUS.INACTIVE }, {transaction});
          await record.update({ status: appConstant.STATUS.INACTIVE }, { transaction });
          if(deviceToken) {
          await Models.DeviceToken.create({ userId: user.id, token: deviceToken }, { transaction })
          }
          await transaction.commit();
          let data = await generateAccessToken(user.id);
          return sendSucessResponse(res,successMessages.loginSuccess, data);
        } 
        /* Create a New user  */
        user = await Models.User.create( {
          countryCode : record.dataValues.countryCode, phone: record.dataValues.phone, isPhoneVerify: appConstant.STATUS.ACTIVE, profile: { name: record.email } },
         { include: [{ model: Models.UserProfile, as: 'profile' }], transaction });

        await user.setRoles([appConstant.ROLES_IDS.USER], { transaction }); // set user role to user here 2 is user role id in database which is created by seeder
        await record.update({ status: appConstant.STATUS.INACTIVE }, { transaction });
        if(deviceToken) {
          await Models.DeviceToken.create({ userId: user.id, token: deviceToken }, { transaction })
        }
        await transaction.commit();
        let data = await generateAccessToken(user.id);
        return sendSucessResponse(res,successMessages.loginSuccess,  { token: data.token, user: data.user });
      } else {
        await transaction.rollback();
        return sendBadResponse(res,errorMessages.invalidTokenProvided);
      }

    } catch (error) {
      console.log('Error in Sign Up', error);
      await transaction.rollback();
      return sendServerErrorResponse(res, error);
    }
  },

  updateUserProfile: async (req, res) => {
    const transaction = await Models.sequelize.transaction();
    try {
      const { name, dob,email,isCompleted } = req.body;
      const userId = req.auth.userId;
      const user = await Models.User.findOne({where:{id: userId}});
      await user.update({email},{transaction});
      const profile = await Models.UserProfile.findOne({
        where: { userId },
      });
      await profile.update(
        { name, dob, isCompleted },
        { transaction }
      );
      await transaction.commit();
      let data = await generateAccessToken(userId);
      return sendSucessResponse(res, successMessages.profileUpdated, data);
    } catch (error) {
      console.log('Error in Sign Up', error);
      await transaction.rollback();
      return sendServerErrorResponse(res, error);
    }
  },

  changePassword: async (req, res) => {
    const transaction = await Models.sequelize.transaction();
    try {
      let { newPassword, oldPassword } = req.body;
      let userId = req.auth.userId;
      let user = await Models.User.findOne({ where: { id: userId } });
      if (MD5(oldPassword) !== user.password) {
        await transaction.rollback();
        return sendBadResponse(res, errorMessages.OldpasswordNotmatched);
      }
      await user.update({ password: MD5(newPassword) }, { transaction });
      await transaction.commit();
      return sendSucessResponse(res, successMessages.passwordChangedSuccessfully)
    } catch (error) {
      console.log('Error in Sign Up', error);
      await transaction.rollback();
      return sendServerErrorResponse(res, error);
    }
  },

  getUserProfile: async (req, res) => {
    try {
      // after submit data
      let user = await Models.User.findOne({
        where: { id: req.auth.user.id },
        raw: true,
        nest: true,
        attributes: ['id', 'email', 'phone','countryCode'],
        include: [
          {
            model: Models.UserProfile,
            as: 'profile',
          },
        ],
      });
      return sendSucessResponse(res, successMessages.recordFatchedSuccessfully, user);
    } catch (error) {
      console.log('Error in Sign Up', error);
      return sendServerErrorResponse(res, error);
    }
  },

  sendOtp: async (req, res) => {
    const transaction = await Models.sequelize.transaction();
    try {
      const { phone, countryCode } = req.body;
      let token = uuidv4();
      let otp = helper.generateOTP();

      /** Check user Status for send OTP */
      let user = await Models.User.findOne({ where: { phone, countryCode } });
      if(user) {
        // if (user.isTokenExpire === appConstant.USER_ACCOUNT_STATUS.TOKEN_EXPIRED)
        //   return sendBadResponse(res, "Session expired please login again");
        // else if (user.status === appConstant.USER_ACCOUNT_STATUS.ACCOUNT_DEACTIVATED)
        //   return sendBadResponse(res, "Your account has been deactivated");
        if (user.status === appConstant.USER_ACCOUNT_STATUS.ACCOUNT_DEACTIVATED_BY_ADMIN)
          return sendBadResponse(res, "Account is locked by administrator");
      }
      let alreadyTokenExist = await Models.Token.findOne({
        where: { phone, countryCode }
      });
      if (alreadyTokenExist) {
        await alreadyTokenExist.update( { otp, token, status: 1}, { transaction });
      } else {
        await Models.Token.create( { phone, countryCode, token, otp, status: 1 }, { transaction });
      }
    
      /* Send OTP to registerd Phone Number */
      let sendOtp = await helper.sendOTP(countryCode, phone ,otp);
      if(!sendOtp){
        await transaction.rollback();
        return sendBadResponse(res, errorMessages.errorInSendOtp);
      }
      await transaction.commit();
      return sendSucessResponse(res, 'Successfully OTP send to phone', {token});
    } catch (error) {
      console.log('Error in Sign Up', error);
      await transaction.rollback();
      return sendServerErrorResponse(res, error);
    }
  },
  
  resendOtp: async (req, res) => {
    const transaction = await Models.sequelize.transaction();
    try {
      let { token } = req.body;
      token = await Models.Token.findOne( { where: { token }});
      if(!token) {
        await transaction.rollback();
        return sendBadResponse(res, errorMessages.InvalidTokenForOtp);
      }
      let otp = helper.generateOTP();
      
      /* Save Into Database */
      await token.update({otp: otp}, {transaction});
      let sendOtp = await helper.sendOTP(token.dataValues.countryCode, token.dataValues.phone ,otp);
      if(!sendOtp){
        await transaction.rollback();
        return sendBadResponse(res, errorMessages.errorInSendOtp);
      }
      await transaction.commit();
      return sendSucessResponse(res, successMessages.successfullySendMessageToPhone, {token: token.token});
    } catch (error) {
      console.log('Error in Send OTP', error);
      await transaction.rollback();
      return sendServerErrorResponse(res, error);
    }
  },

  logOut : async(req,res) =>{
    const transaction = await Models.sequelize.transaction();
    try {
      const userId = req.auth.user.id;
      await Models.User.update({isTokenExpire: appConstant.STATUS.ACTIVE}, {where: { id:userId}, transaction});
      await Models.DeviceToken.update({isActive:appConstant.STATUS.INACTIVE}, {where:{userId: userId}, transaction});
      await transaction.commit();
      return sendSucessResponse(res, successMessages.logOutSuccessfully);
    } catch (error) {
      console.log('Error in Log OUT', error);
      await transaction.rollback();
      return sendServerErrorResponse(res, error);
    }
  },

  deactivateAccount:  async(req,res) =>{
    const transaction = await Models.sequelize.transaction();
    try {
      const userId = req.auth.user.id;
      await Models.User.update({isTokenExpire: appConstant.STATUS.ACTIVE, status: appConstant.USER_ACCOUNT_STATUS.ACCOUNT_DEACTIVATED }, {where: { id:userId}, transaction});
      await Models.DeviceToken.update({isActive:appConstant.STATUS.INACTIVE}, {where:{userId: userId}, transaction});
      await transaction.commit();
      return sendSucessResponse(res, successMessages.acountDeactivated);
    } catch (error) {
      console.log('Error in Deactivate Account', error);
      await transaction.rollback();
      return sendServerErrorResponse(res, error);
    }
  }


};
