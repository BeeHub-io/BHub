const express = require('express');
const taskController = require('./controller/ApiController.js');
const router = express.Router();

// post request to get restaurants based off of user coordinates
router.post('/', controller.getAllRestaurants,(req, res) => {
    res.status(200).json(res.locals.allRestaurants);
})

router.post('/search-input', controller.search, (req, res) => {
    res.status(200).json(res.locals.searchResults);
})

module.exports = router;