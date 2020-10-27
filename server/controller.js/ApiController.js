const db = require('../models/TaskModel');
const controller = {};

// Handle initial request to yelp api to retrieve all restaurants
controller.getAllRestaurants = async (req, res, next) => {
    //destructure lon and lat from req.body
    const { longitude, latitude } = req.body;

    // radius ~5
    const queryAllString = `?latitude=${latitude}&longitude=${longitude}&radius=8046.72`;
    try {
        await fetch(`https://api.yelp.com/v3/businesses/search/${queryAllString}/`)
              .then(response => response.json())
              // filter out restaurants with more than 200 reviews
              // filterout out chains and franchises
              .then(data => {
                  console.log(data)
                  return next();
              });
    } catch(err) {
        return next(err);
    };
};

// Handle search bar query
controller.search = async (req, res, next) => {
    // destructure restaurant to query for
    const { locale } = req.body;

    // create query string to use
    const querySearchString = `?term=${locale}`;
    try { 
        // insert query string to fetch end point
        await fetch(`https://api.yelp.com/v3/businesses/search/${querySearchString}/`)
              .then(response => response.json())
              .then(data => {
                  // double check what the response looks like in postman and adjust as needed
                  // could be restaurant coordinates  
                  res.locals.searchResults = data;
                  return next();
              });
    } catch (err) {
        return next(err);
    };
};

module.exports = controller;