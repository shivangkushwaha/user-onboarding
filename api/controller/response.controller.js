 const appConstant = require("../../appConstant");
const errorMessages = require("../../config/errorMessages.json");
 module.exports = {
    sendBadResponse : (res,message, statusCode = appConstant.STATUS_CODE.BAD_REQUEST) => {
        return res.status(statusCode).send({
            success: false,
            display: true,
            message: message,
            responseData: {}
        });
    },
    sendSucessResponse : (res, message, response = {}, statusCode = appConstant.STATUS_CODE.OK) =>{
        return res.status(statusCode).send({
            success: true,
            display: true,
            message: message,
            responseData: response
        });
    },
    sendServerErrorResponse : (res, error = errorMessages.somethingWentWrong) =>{
        console.log(`internal Server Error at ${Date.now()} , with Message : ${error.toString()}`)
        return res.status(appConstant.STATUS_CODE.SERVER_ERROR).send({
            success: false,
            display: true,
            message: error.toString(),
            responseData: {}
        });
    },
    responseForGet : (limit, totalRecords, totalPages, currentPage, data) =>{
        return { limit, totalRecords, totalPages, data, currentPage, count: data.length };
    }

 }