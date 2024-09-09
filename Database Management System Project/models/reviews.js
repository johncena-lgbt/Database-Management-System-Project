const { query } = require('../database');
const { EMPTY_RESULT_ERROR, SQL_ERROR_CODE, UNIQUE_VIOLATION_ERROR, RAISE_EXCEPTION } = require('../errors');

// Task 2
// Create review
module.exports.createReview = function createReview(productId, rating, reviewText, memberId, saleOrderItemId) {
    return query('CALL create_review($1, $2, $3, $4, $5)', [memberId, productId, saleOrderItemId, rating, reviewText])
    .then(function (result) {
        console.log('Review created');
    })
    .catch((error) => {
        if (error.code === SQL_ERROR_CODE.RAISE_EXCEPTION) {
            // Custom handling based on specific error messages from PostgreSQL if needed
            if (error.message.includes("Product with ID")) {
                throw new Error(`Product ${productId} not found.`);
            } else if (error.message.includes("Order item is not part of a completed order")) {
                throw new Error('Order item is not part of a completed order or does not exist.');
            } else if (error.message.includes("Review already exists")) {
                throw new Error(`Review already exists for product ${productId}.`);
            }
        }
        throw error; // For unhandled errors
    });
};

// Update review
module.exports.updateReview = function updateReview(reviewId, rating, reviewText, memberId) {
    return query('CALL update_review($1, $2, $3, $4)', [reviewId, rating, reviewText, memberId])
    .then(function (result) {
        console.log('Review updated');
    })
    .catch((error) => {
        if (error.code === SQL_ERROR_CODE.RAISE_EXCEPTION){
            throw new Error(`Review with ID ${reviewId} does not exists or belongs to another member.`)
        }
        throw error;
    });
};

// Get all Reviews
module.exports.getAllReviews = function getAllReviews(memberId) {
    const sql = 'SELECT * FROM get_all_reviews($1) AS result';
    return query(sql, [memberId])
        .then(function(result) {
            const rows = result.rows;
            return rows
        })
        .catch (function(error) {
            throw error
        })
}

// Get review by ID
module.exports.getReviewById = function getReviewById(reviewId) {
    const sql = 'SELECT * FROM get_review($1) AS result';
    return query(sql, [reviewId])
        .then(function(result) {
            const rows = result.rows;
            return rows
        })
        .catch (function(error) {
            throw error
        })
}

// Get review by product ID
module.exports.getReviewByProductId = function getReviewByProductId(productId, rating, order) {
    const sql = 'SELECT * FROM get_reviews_by_product($1, $2, $3)';
    return query(sql, [productId, rating, order])
        .then(function(result) {
            return result.rows;
        })
        .catch (function(error) {
            throw error;
        });
};


// Delete review
module.exports.deleteReview = function deleteReview(reviewId, memberId) {
    return query('CALL delete_review($1, $2)', [reviewId, memberId])
    .then(function (result) {
        console.log('Review deleted');
    })
    .catch((error) => {
        if (error.code === '23505') { 
            throw new Error(error.message);
        }
        throw error;
    });
}