
const { body,validationResult } = require("express-validator");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const s3 = require("../config/s3config");
const apiResponse = require("../helpers/apiResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require("../helpers/mailer");
const { constants } = require("../helpers/constants");
const auth = require("../middleware/jwt");
const  Db = require('../models/Useroperations');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads');
	},
	filename: function (req, file, cb) {
		cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
	}
});
var upload = multer({ storage: storage });

/**
 * Verify Email exist orn ot
 *
 * @param {string}      email
 *
 * @returns {Object}
 */
exports.validateEmail = [
	body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified1.")
		.isEmail().withMessage("Email must be a valid email address."),
	body("email").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				var query = {email : req.body.email};
				UserModel.findOne(query).then(user => {
					if (user) {
						return apiResponse.successResponse(0,res,"Specified email already exist.");
					}else{
						return apiResponse.successResponse(1,res,"Email not exist.");
					}
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];

/**
 * User registration.
 *
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.register = [
	// Validate fields.
	body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.")
		.isEmail().withMessage("Email must be a valid email address.").custom((value) => {
			return Db.getUserByEmail(value).then((user) => {
				if (user) {
					return Promise.reject("E-mail already in use");
				}
			})
		}),
	body("password").isLength({ min: 8 }).trim().withMessage("Password must be 8 characters or greater."),
	// Sanitize fields.
	body("email").escape(),
	body("password").escape(),
	// Process request after validation and sanitization.
	(req, res) => {
		try {
			// Extract the validation errors from a request.
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				// Display sanitized values/errors messages.
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				//hash input password
				bcrypt.hash(req.body.password,10,function(err, hash) {
					// generate OTP for confirmation
					//let otp = utility.randomNumber(4);
					// Create User object with escaped and trimmed data
					var user = {
							Email: req.body.email,
							PasswordHash: hash,
							UserName: req.body.user_name,
							FirstName: req.body.first_name,
							LastName: req.body.last_name,
							City: req.body.city,
							//confirmOTP: otp
						};
					// Html email body
					//let html = "<p>Please Confirm your Account.</p><p>OTP: "+otp+"</p>";
					let html = "<p>Welcome You have successfully registered.</p>";
					// Send confirmation email
					mailer.send(
						constants.confirmEmails.from, 
						req.body.email,
						"Welcome",
						html
					).then(function(){
						
						// Save user.
						Db.addUser(user).then((result) => {
							if (result) {
								return apiResponse.successResponseWithData(0,res,"You have successfully registered.",result );
							}
						})
						
					}).catch(err => {
						console.log(err);
						return apiResponse.ErrorResponse(res,err);
					}) ;
				});
			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}];

/**
 * User login.
 *
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.login = [
	body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.")
		.isEmail().withMessage("Email must be a valid email address."),
	body("password").isLength({ min: 8 }).trim().withMessage("Password must be specified."),
	body("email").escape(),
	body("password").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Please check entered username and password again!", errors.array());
			}else {
				Db.getUserByEmail(req.body.email).then(user => {
					if (user) {
						//Compare given password with db's hash.
						bcrypt.compare(req.body.password,user.PasswordHash,function (err,same) {
							if(same){
								//Check account confirmation.
								// if(user.isConfirmed){
									// Check User's account active or not.
									// if(user.status) {
										let userData = {
											id: user.Id,
											user : user.UserName,
											email: user.Email,
										};
										//Prepare JWT token for authentication
										const jwtPayload = userData;
										const jwtData = {
											expiresIn: process.env.JWT_TIMEOUT_DURATION,
										};
										const secret = process.env.JWT_SECRET;
										//Generated JWT token with Payload and secret.
										userData.auth_token = jwt.sign(jwtPayload, secret, jwtData);
										return apiResponse.successResponseWithData(1,res,"Login Success.", userData);
									// }else {
									// 	return apiResponse.unauthorizedResponse(res, "Account is not active. Please contact admin.");
									// }
								// }else{
								// 	return apiResponse.unauthorizedResponse(res, "Account is not confirmed. Please confirm your account.");
								// }
							}else{
								return apiResponse.successResponse(0,res, "Email or Password wrong.");
							}
						});
					}else{
						return apiResponse.successResponse(0,res, "Email or Password wrong.");
					}
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];

/**
 * get user profile
 *
 * @returns {Object}
 */
exports.userProfile = [
	auth,
	(req, res) => {
		try {
			console.log(req.user);
			var query = {_id : req.user._id};
			UserModel.findOne(query).then(user => {
				if (user) {
					return apiResponse.successResponseWithData(0,res,"user found.",user );
				}else{
					return apiResponse.successResponseWithData(1,res,"user not found.",[]);
				}
			});
			
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];

/**
 * get user profile
 *
 * @returns {Object}
 */
exports.userList = [
	//auth,
	(req, res) => {

		try {

			Db.getUsers().then((result) => {
				if (result) {
					return apiResponse.successResponseWithData(0,res,"user found.",result );
				}
			})

		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
}];


/**
 * get user profile
 *
 * @returns {Object}
 */
exports.upload = [
	//auth,
	upload.single('input_files'),
	(req, res) => {
		try {
			//const uploadFile = (fileName) => {
			    // Read content from the file
			    const file = req.file;

			    const fileContent = fs.readFileSync('uploads/'+file.filename);
			    // Setting up S3 upload parameters
			    const params = {
			        Bucket: process.env.AWS_BUCKET,
			        Key: file.filename, 
			        Body: fileContent
			    };

			    // Uploading files to the bucket
			    s3.upload(params, function(err, data) {
			        if (err) {
			            throw err;
			        }

			        //remove file 
			        var filePath = 'uploads/'+params.Key; 
					fs.unlinkSync(filePath);
			        return apiResponse.successResponseWithData(0,res,"File uploaded successfully at "+data.Location+".",data);
			    });
			//};			
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
}];