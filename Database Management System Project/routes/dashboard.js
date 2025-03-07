const express = require('express');
const membersController = require('../controllers/membersController');
const jwtMiddleware = require('../middleware/jwtMiddleware');

const router = express.Router();

// All routes in this file will use the jwtMiddleware to verify the token and check if the user is an admin.
// Here the jwtMiddleware is applied at the router level to apply to all routes in this file
// But you can also apply the jwtMiddleware to individual routes
// router.use(jwtMiddleware.verifyToken, jwtMiddleware.verifyIsAdmin);

router.use(jwtMiddleware.verifyToken, jwtMiddleware.verifyIsAdmin);

router.get('/ageGroupSpending',membersController.getTotalSpending, membersController.retrieveAgeGroupSpending);

// To get favourite summary
router.get('/favouriteSummary', membersController.getFavouriteSummary);


module.exports = router;