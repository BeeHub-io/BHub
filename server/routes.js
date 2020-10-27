const express = require('express');
const taskController = require('./controller/ApiController.js');
const router = express.Router();

// post request to get restaurants based off of user coordinates
router.get('/', controller.getAllRestaurants,(req, res) => {
    res.status(200).json(res.locals.allRestaurants);
})

module.exports = router;