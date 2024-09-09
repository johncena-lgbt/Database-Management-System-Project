const { query } = require('../database');
const { EMPTY_RESULT_ERROR, SQL_ERROR_CODE, UNIQUE_VIOLATION_ERROR } = require('../errors');

module.exports.createFavourites = function createFavourites (productId, memberId) {
    return query('CALL add_favourite($1,$2)', [memberId, productId])
        .then(function (result){
            console.log('Favourite created');
        })
        .catch((error)=> {
            if (error.code === SQL_ERROR_CODE.RAISE_EXCEPTION){
                if(error.message.includes('This product is already in your favourite lists')) {
                    throw new Error('This product is already in your favourite lists');
                }
            }
        })
}

module.exports.getAllFavourites = function getAllFavourites (memberId) {
    const sql = ('SELECT * FROM get_all_favorites($1)');

    return query(sql, [memberId])
        .then(function (result){
            if(result.rows.length === 0) {
                throw new Error(EMPTY_RESULT_ERROR);
            }
            return result.rows;
        })
        .catch((error) => {
            if (error.message === EMPTY_RESULT_ERROR){
                throw new Error('No favourites found');
            }
        })
}

module.exports.deleteFavourite = function deleteFavourite (favouriteId) {
    return query('CALL remove_favourite($1)', [favouriteId])
        .then(function (result){
            console.log('Favourite deleted');
        })
        .catch((error)=> {
            if (error.code === SQL_ERROR_CODE.RAISE_EXCEPTION){
                throw new Error('Favourite not found');
            }
        })
}