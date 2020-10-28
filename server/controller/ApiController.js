const db = require('../models/TaskModel');
const controller = {};

// Handle initial request to yelp api to retrieve all restaurants.
controller.getAllRestaurants = async (req, res, next) => {
  // destructure LON, LAT, and radius from req.body. radius defaults to 5 miles
  const { longitude, latitude, radius = 8046.72 } = req.body;
  console.log('CONTROLLER > GET ALL > LONGITUDE: ', longitude);
  console.log('CONTROLLER > GET ALL > LATITUDE: ', latitude);
  const queryAllString = `?latitude=${latitude}&longitude=${longitude}&radius=${radius}`;
  try {
    await fetch(`https://api.yelp.com/v3/businesses/search/${queryAllString}/`)
      .then((response) => response.json())
      .then((data) => {
        // filterout out chains and franchises, with more than 50 reviews ??
        // OR if we want to specify restaurants we need to do it manually
        // e.g array of restaurants to filter out
        const notFranchises = data.filter((el) => el.review_count < 50);
        res.locals.allFilteredRestaurants = notFranchises;
        return next();
      });
  } catch (err) {
    return next(err);
  }
};

// Handle search bar query
controller.search = async (req, res, next) => {
  // destructure restaurant to query for. radius defaults is 5 miles
  const { longitude, latitude, locale, radius = 8046.72 } = req.body;
  // create query string to use
  const querySearchString = `?term=${locale}&latitude=${latitude}&longitude=${longitude}&radius=${radius}`;
  try {
    // insert query string to fetch end point
    await fetch(
      `https://api.yelp.com/v3/businesses/search/${querySearchString}/`
    )
      .then((response) => response.json())
      .then((data) => {
        // double check what the response looks like in postman and adjust as needed
        // could be restaurant coordinates
        res.locals.searchResults = data;
        return next();
      });
  } catch (err) {
    return next(err);
  }
};

module.exports = controller;
