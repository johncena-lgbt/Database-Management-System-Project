const { EMPTY_RESULT_ERROR, UNIQUE_VIOLATION_ERROR, DUPLICATE_TABLE_ERROR } = require('../errors');
const reviewsModel = require('../models/reviews');

// Task 2
// Create review
module.exports.createReview = function (req, res) {
    const { productId, rating, reviewText, memberId} = req.body;
    const saleOrderItemId = req.body.saleOrderItemId;  

    return reviewsModel
        .createReview(productId, rating, reviewText, memberId, saleOrderItemId)
        .then(function () {
            return res.sendStatus(201);
        })
        .catch((error) => {
            console.error('Error:', error.message);
            if (error.message.includes("not found") || error.message.includes("does not exist")) {
                return res.status(404).json({ error: error.message });
            } else if (error.message.includes("already exists")) {
                return res.status(409).json({ error: error.message }); // Conflict
            }
            return res.status(500).json({ error: 'Internal server error' });
        });
}

// Update review
module.exports.updateReview = function (req,res) {
    const { reviewId, rating, reviewText, memberId } = req.body;

    return reviewsModel
        .updateReview(reviewId, rating, reviewText, memberId)
        .then(function () {
            return res.sendStatus(200);
        })
        .catch((error) => {
            if(!reviewId){
                return res.status(400).json({
                    error: 'Please provide a review ID'
                })
            }
            if(error.message.includes("does not exists")){
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Internal server error' });
        });
}

// Get all reviews
module.exports.getAllReviews = function (req, res) {
    const memberId = req.query.member_id; // Read from query parameters

    return reviewsModel
        .getAllReviews(memberId)
        .then(function (reviews) {
            if (!reviews) {
                return res.status(404).json({ error: EMPTY_RESULT_ERROR });
            }
            return res.json({ reviews });
        })
        .catch((error) => {
            console.error('Error:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        });
}

// Get review by id
module.exports.getReviewById = function (req, res) {
    const reviewId = req.query.review_id; // Read from query parameters

    return reviewsModel
        .getReviewById(reviewId)
        .then(function (review) {
            if (!review) {
                return res.status(404).json({ error: EMPTY_RESULT_ERROR });
            }
            return res.json({ review });
        })
        .catch((error) => {
            console.error('Error:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        });
}

// Get review by product id
module.exports.getReviewByProductId = function (req, res) {
    const productId = req.params.productId; 
    const rating = req.query.rating || null;
    const order = req.query.order || 'reviewDate';

    reviewsModel.getReviewByProductId(productId, rating, order)
        .then(reviews => {
            console.log(reviews);
            if (!reviews.length) {
                return res.status(404).json({ error: 'No reviews found for this product.' });
            }
            res.json({ reviews });
        })
        .catch(error => {
            console.error('Error fetching reviews:', error.message); 
            res.status(500).json({ error: 'Internal server error' }); 
        });
};

// Delete review
module.exports.deleteReview = function (req,res) {
    const reviewId = req.body.reviewId;
    const memberId = req.body.memberId;

    return reviewsModel
        .deleteReview(reviewId, memberId)
        .then(function () {
            return res.sendStatus(200);
        })
        .catch((error) => {
            console.error('Error:', error.message);
            if(!reviewId){
                return res.status(400).json({
                    error: 'Please provide a review ID'
                })
            }
            if(error.message.includes("does not exists")){
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Internal server error' });
        });
}