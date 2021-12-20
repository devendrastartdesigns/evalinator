var express = require("express");
const AssessmentController = require("../controllers/AssessmentController");

var router = express.Router();

//router.post("/save", AssessmentController.save);
router.get("/list", AssessmentController.assessmentList);
router.get("/templateList", AssessmentController.templateList);
router.get("/assessmentTypes", AssessmentController.assessmentTypes);
router.post("/save", AssessmentController.save);


module.exports = router;