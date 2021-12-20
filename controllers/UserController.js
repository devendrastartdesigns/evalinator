const UserModel = require("../models/UserModel");
const apiResponse = require("../helpers/apiResponse");
const dbconfig = require("../config/dbconfig");
const sql = require('mssql');

const multer = require('multer');
const path = require('path');

const fs = require('fs');
const AWS = require('aws-sdk');
const s3 = require("../config/s3config");


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
 * get user profile
 *
 * @returns {Object}
 */
exports.userList = [
	//auth,
	(req, res) => {

		try {

			async function foo() {
		        try {
		         // make sure that any items are correctly URL encoded in the connection string
		         await sql.connect(dbconfig)
		         const result = await sql.query`SELECT * FROM [AspNetUsers]`
		         return  result.recordsets;
		         
		        } catch (err) {
		          return err;
		        }
		    }
		    foo().then((result)=>{
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