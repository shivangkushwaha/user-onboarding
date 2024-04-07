const appConstants = require("./appConstants.json");
// const mailHandler = require("../handlers/mail");

exports.actionCompleteResponse = (res, data, msg, display = false) => {
	const response = {
		message: msg || appConstants.EXECUTEDSUCCESS,
		success: appConstants.ACTIONCOMPLETE,
		display: display ,
		data: data || {},
	};
	res.ok(response);
};

exports.sendError = (res, err = appConstants.ERRORINEXECUTION, data, isUncaughtException = false, req = null, display = false) => {
	let errMsg = err.toString();
	errMsg = errMsg.replace("Something went wrong.", "");
	errMsg = errMsg.split("Error:").join("");
	errMsg = errMsg.trim();
	if (typeof data !== "object") data = {data};
	const response = {
		message: errMsg,
		success: appConstants.ERRORINEXECUTION,
		display: display,
		data: data || {},
	};

	res.ok(response);
};