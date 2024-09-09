const favouriteModel = require('../models/favourites');

// Create favourite
module.exports.createFavourite = function (req,res) {
    const { productId, memberId } = req.body;

    return favouriteModel
        .createFavourites(productId, memberId)
        .then(function(){
            return res.sendStatus(201)
        })
        .catch((error) => {
            console.error('Error', error.message);
            if(error.message.includes('This product is already in your favourite lists')){
                return res.status(404).json({error: error.message})
            }
        })
}

// Get all favourites
module.exports.getAllFavourites = function (req,res) {
    const memberId = req.params.memberId;

    return favouriteModel
        .getAllFavourites(memberId)
        .then(function(favourites){
            return res.json({favourites: favourites})
        })
        .catch((error) => {
            console.error('Error', error.message);
            return res.status(404).json({error: error.message})
        })
}

// Delete favourite
module.exports.deleteFavourite = function (req,res) {
    const favouriteId = req.params.favouriteId;

    return favouriteModel
        .deleteFavourite(favouriteId)
        .then(function(){
            return res.sendStatus(204)
        })
        .catch((error) => {
            console.error('Error', error.message);
            return res.status(404).json({error: error.message})
        })
}