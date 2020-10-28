const express = require('express');
const app = express();
const routes = require('./routes');
const cors = require('cors');
const PORT = 3333;

// handle incoming json files
app.use(express.json());

// handle form submissions
app.use(express.urlencoded({ extended: true }));

// handle cors
app.use(cors());

// handle api reqs
app.use('/api', routes);

// catch all error handler 
app.use('*', (req, res) => {
    res.status(200).json('error, endpoint not found')
});

//global error handler 
app.use((err, req, res, next) => {
    const defaultErr = {
        log: 'express error handler caught unknown middleware error',
        status: 400,
        message: { err: 'An error happened' },
      };
      const errorObj = { ...defaultErr, ...err };
      return res.status(errorObj.status).send(JSON.stringify(errorObj.message));    
})

app.listen(PORT, () => console.log(`Listening to port ${PORT}`));