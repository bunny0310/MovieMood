var express = require('express');
var router = express.Router();
var mainController=require('../Controllers/mainController');

/* GET home page. */
router.get('/',mainController.index);
router.post('/recognize',mainController.detectMood);
module.exports = router;
