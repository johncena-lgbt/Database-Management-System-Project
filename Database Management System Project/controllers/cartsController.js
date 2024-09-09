const e = require('express');
const { EMPTY_RESULT_ERROR, UNIQUE_VIOLATION_ERROR } = require('../errors');
const cartsModel = require('../models/carts');

// To create a cart and to put products in the cart
module.exports.createCart = function (req, res) {
    const {productId, quantity, memberId} = req.body;

    return cartsModel
        .createCart(productId, quantity, memberId)
            .then(function (){
                return res.sendStatus(201);
            })
            .catch((error) => {
                if(error.message.includes("does not exist")){
                    return res.status(404).json({ error: error.message });
                }
                if(error.message.includes("Quantity cannot be 0")){
                    return res.status(400).json({ error: error.message });
                }
                console.error('Error:', error.message);
                return res.status(500).json({ error: 'Internal server error' });
            })
}

// To get all cart items
module.exports.getAllCartItems = function (req,res) {
    const memberId = req.query.member_id;

    return cartsModel
        .getAllCartItems(memberId)
            .then(function (cartItems) {
                return res.json({ cartItems });
            })
            .catch((error) => {
                console.error('Error:', error.message);
                return res.status(500).json({ error: 'Internal server error' });
            })
}

// To update a cart quantity
module.exports.updateCartItem = function (req, res) {
    const {productId, quantity, memberId, cartItemId} = req.body;

    return cartsModel
        .updateCartItem(productId, quantity, memberId, cartItemId)
            .then(function (){
                return res.sendStatus(200);
            })
            .catch((error) => {
                if(error.message.includes("Quantity cannot be 0")){
                    return res.status(400).json({ error: error.message });
                }
                console.error('Error:', error.message);
                return res.status(500).json({ error: 'Internal server error' });
            })

}

// To update cart item quantity in bulk
module.exports.updateMultipleCartItems = function (req, res) {
    const {cartItems} = req.body;

    return cartsModel
        .updateMultipleCartItems(cartItems)
            .then(function (){
                return res.sendStatus(200);
            })
            .catch((error) => {
                if(error.message.includes("Quantity cannot be 0")){
                    return res.status(400).json({ error: error.message });
                }
                console.error('Error:', error.message);
                return res.status(500).json({ error: 'Internal server error' });
            })
}


// To delete a cart item
module.exports.deleteSingleCartItem = function (req, res) {
    const {productId, memberId, cartItemId} = req.body;

    return cartsModel
        .deleteSingleCartItem(productId, memberId, cartItemId)
            .then(function (){
                return res.sendStatus(200);
            })
            .catch((error) => {
                console.error('Error:', error.message);
                return res.status(500).json({ error: 'Internal server error' });
            })
}

// To delete cart items in bulk
module.exports.deleteMultipleCartItems = function (req, res) {
    const {cartItems} = req.body;

    return cartsModel
        .deleteMultipleCartItems(cartItems)
            .then(function (){
                return res.sendStatus(200);
            })
            .catch((error) => {
                console.error('Error:', error.message);
                return res.status(500).json({ error: 'Internal server error' });
            })
}

// To get cart summary
module.exports.getCartSummary = function (req,res) {
    const memberId = req.query.member_id;

    return cartsModel
        .getCartSummary(memberId)
            .then(function (cartSummary) {
                return res.json({ cartSummary });
            })
            .catch((error) => {
                console.error('Error:', error.message);
                return res.status(500).json({ error: 'Internal server error' });
            })
}

// Cart Checkout
module.exports.checkout = function (req,res) {
    const memberId = req.body.memberId;
    
    return cartsModel
        .checkout(memberId)
            .then(function(cartItems){
                return res.status(200).json({ cartItems });
            })
            .catch(error => {
                console.error('Error:', error.message);
                if(error.message.includes("Out of stock")){
                    return res.status(404).json({ error: error.message });
                }
                return res.status(500).json({ error: 'Internal server error' });
            })
}