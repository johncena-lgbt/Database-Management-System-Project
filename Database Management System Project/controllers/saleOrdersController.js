const { EMPTY_RESULT_ERROR, UNIQUE_VIOLATION_ERROR, DUPLICATE_TABLE_ERROR } = require('../errors');
const saleOrdersModel = require('../models/saleOrders');
const membersModel = require('../models/members');
const { FileEnumerator } = require('eslint/use-at-your-own-risk');

module.exports.retrieveAll = function (req, res) {
    let memberId = res.locals.member_id;
    const filters = req.query;

    membersModel
        .isAdmin(memberId)
        .then(function (isAdmin) {
            if (isAdmin) {
                memberId = null;
            }
            
            return saleOrdersModel.retrieveAll({...filters });
        })
        .then(function (saleOrders) {
            return res.json({ saleOrders: saleOrders });
        })
        .catch(function (error) {
            console.error(error);
            if (error instanceof EMPTY_RESULT_ERROR) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        });
}