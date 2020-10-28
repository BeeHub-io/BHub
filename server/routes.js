const express = require('express');
const controller = require('./controller/ApiController.js');
const router = express.Router();

// post request to get filtered restaurants based on user coordinates
router.post('/getAll', controller.getAllRestaurants, (req, res) => {
  res.status(200).json(res.locals.allFilteredRestaurants);
});

// post req specific to search bar query
router.post('/search-input', controller.search, (req, res) => {
  res.status(200).json(res.locals.searchResults);
});

module.exports = router;
