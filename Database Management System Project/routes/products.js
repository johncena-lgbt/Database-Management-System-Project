// See https://expressjs.com/en/guide/routing.html for routing

const express = require('express');
const productsController = require('../controllers/productsController');
const reviewsController = require('../controllers/reviewsController');
const jwtMiddleware = require('../middleware/jwtMiddleware');

const router = express.Router();

// All routes in this file will use the jwtMiddleware to verify the token and check if the user is an admin.
// Here the jwtMiddleware is applied at the router level to apply to all routes in this file
// But you can also apply the jwtMiddleware to individual routes
// router.use(jwtMiddleware.verifyToken, jwtMiddleware.verifyIsAdmin);

router.use(jwtMiddleware.verifyToken);

router.get('/:code', productsController.retrieveById);

router.get('/', productsController.retrieveAll);

// Get review by product ID
router.get('/:productId/reviews', reviewsController.getReviewByProductId);

module.exports = router;
