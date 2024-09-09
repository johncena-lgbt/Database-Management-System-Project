// See https://expressjs.com/en/guide/routing.html for routing

const express = require('express');
const reviewsController = require('../controllers/reviewsController');
const jwtMiddleware = require('../middleware/jwtMiddleware');

const router = express.Router();

// All routes in this file will use the jwtMiddleware to verify the token and check if the user is an admin.
// Here the jwtMiddleware is applied at the router level to apply to all routes in this file
// But you can also apply the jwtMiddleware to individual routes
// router.use(jwtMiddleware.verifyToken, jwtMiddleware.verifyIsAdmin);

// Task 2 
// Create review
router.post('/',  reviewsController.createReview);

// Update review
router.put('/:reviewId', reviewsController.updateReview);

// Get all reviews
router.get('/', reviewsController.getAllReviews);

// Get review by id
router.get('/:reviewId', reviewsController.getReviewById);

// Delete review
router.delete('/', reviewsController.deleteReview);

router.use(jwtMiddleware.verifyToken);


module.exports = router;