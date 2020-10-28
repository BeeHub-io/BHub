const express = require('express');
const taskController = require('./controller/ApiController.js');
const router = express.Router();

// post request to get filetered restaurants based on user coordinates 
router.post('/', controller.getAllRestaurants,(req, res) => {
    res.status(200).json(res.locals.allFilteredRestaurants);
})

// post req specific to search bar query
router.post('/search-input', controller.search, (req, res) => {
    res.status(200).json(res.locals.searchResults);
})

module.exports = router;