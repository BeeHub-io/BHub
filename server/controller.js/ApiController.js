const db = require('../models/TaskModel');
const controller = {};

// Making request to yelp api to retrieve restaurants
const getAllRestaurants = async () => {
    // static coordiantes, will change 
    const queryString = '?latitude=37.78825&longitude=-122.4324';
    try {
        await fetch(`https://api.yelp.com/v3/businesses/search/${queryString}/`)
              .then(response => response.json())
              .then(data => console.log(data));
    } catch(err) {
        return next(err);
    };
};

module.exports = controller;