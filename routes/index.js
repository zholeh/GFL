const express = require('express');
const router = express.Router();

/* GET home page. */
router.get("/test", function (request, response){
  response.send("Test");
});


router.get('/', function(req, res, next) {
  res.status(200).send({message: 'Hello World!'})
});

module.exports = router;
