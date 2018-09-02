var express = require('express');
var router = express.Router();
var ComplexityController = require('../controller/complexity_controller');


router.get('/', ComplexityController.GetComplexity );

module.exports = router;
