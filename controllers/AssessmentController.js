const UserModel = require("../models/UserModel");
const apiResponse = require("../helpers/apiResponse");
const dbconfig = require("../config/dbconfig");
const sql = require('mssql');

const multer = require('multer');
const path = require('path');


/**
 * get user profile
 *
 * @returns {Object}
 */
exports.assessmentList = [
	//auth,
	(req, res) => {

		try {

			async function getAssessmentList() {
		        try {
					let authorId = 1;
		         // make sure that any items are correctly URL encoded in the connection string
		         await sql.connect(dbconfig)
		         const result = await sql.query`SELECT * FROM [tbl_survey_master]
				  where created_by = 1 ` 
		         return  result.recordsets;
		         
		        } catch (err) {
		          return err;
		        }
		    }
		    getAssessmentList().then((result)=>{
		        if (result) {
					return apiResponse.successResponseWithData(0,res,"assessments found.",result );
				}
		    })

		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
}];

/**
 * get list of templates for assessments
 *
 * @returns {Object}
 */
 exports.templateList = [
	//auth,
	(req, res) => {

		try {

			async function getTemplateList() {
		        try {
					
		         // make sure that any items are correctly URL encoded in the connection string
		         await sql.connect(dbconfig)
		         const result = await sql.query`Select 
				 b.survey_id, b.survey_name, a.template_desc, c.survey_guid, b.survey_type, d.media_id, d.media_key, d.media_extension, a.sequence_num  
				 from 
				 tbl_survey_templates a, tbl_survey_master b, tbl_survey_guid c, tbl_media_master d, tbl_media_mapping e 
				 where 
				 a.tool_id = b.survey_id 
				 and a.tool_id = c.survey_id 
				 and a.tool_id = e.media_purpose_id 
				 and e.media_purpose = 2
				 and d.media_id = e.media_id 
				 and e.end_time is null 
				 order by a.sequence_num asc ` 
		         return  result.recordsets;
		         
		        } catch (err) {
		          return err;
		        }
		    }
		    getTemplateList().then((result)=>{
		        if (result) {
					return apiResponse.successResponseWithData(0,res,"templates found.",result );
				}
		    })

		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
}];

/**
 * get list of templates for assessments
 *
 * @returns {Object}
 */
 exports.assessmentTypes = [
	//auth,
	(req, res) => {

		try {

			async function getAssessmentTypes() {
		        try {
					
		         // make sure that any items are correctly URL encoded in the connection string
		         await sql.connect(dbconfig)
		         const result = await sql.query`Select assessment_type, assessment_type_name 
				 from tbl_assessment_types` 
		         return  result.recordsets;
		         
		        } catch (err) {
		          return err;
		        }
		    }
		    getAssessmentTypes().then((result)=>{
		        if (result) {
					return apiResponse.successResponseWithData(0,res,"templates found.",result );
				}
		    })

		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
}];

/**
 * get list of templates for assessments
 *
 * @returns {Object}
 */
 exports.save = [
	//auth,
	(req, res) => {
			console.log(req)

		try {
			
			async function saveAssessment() {
		        try {
					let name = req.body.assesement_name;
					let type = req.body.templateType;
					let userId = req.body.userId;
					let date = new Date();
					let description ='';
					let is_published =0;
		         // make sure that any items are correctly URL encoded in the connection string
		        await sql.connect(dbconfig)
				//survey_name, survey_desc, survey_desc_post, survey_type, is_published, created_by, created_datetime, published_datetime
				const result = await sql.query`insert into tbl_survey_master (survey_name,created_datetime,survey_desc, survey_desc_post, survey_type, is_published, created_by) values(${name},${date},${description},${description},${type},${is_published},${userId})` ;
				
		         return  result;
				 //return  result;
		         
		        } catch (err) {
		          return err;
		        }
		    }
		    saveAssessment().then((result)=>{
		        if (result) {
					return apiResponse.successResponseWithData(0,res,"templates found.",result );
				}
		    })

		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
}];

