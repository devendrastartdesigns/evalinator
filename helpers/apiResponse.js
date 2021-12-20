exports.successResponse = function (status, res, msg) {
	var data = {
		status: status,
		message: msg
	};
	return res.status(200).json(data);
};

exports.successResponseWithData = function (status, res, msg, data) {
	var resData = {
		status: status,
		message: msg,
		data: data
	};
	return res.status(200).json(resData);
};

exports.validationErrorWithData = function (res, msg, data) {
	var resData = {
		status: 0,
		message: msg,
		data: data
	};
	return res.status(200).json(resData);
};

exports.ErrorResponse = function (res, msg) {
	var data = {
		status: 0,
		message: msg,
	};
	return res.status(500).json(data);
};

exports.notFoundResponse = function (res, msg) {
	var data = {
		status: 0,
		message: msg,
	};
	return res.status(404).json(data);
};

exports.unauthorizedResponse = function (res, msg) {
	var data = {
		status: 0,
		message: msg,
	};
	return res.status(401).json(data);
};