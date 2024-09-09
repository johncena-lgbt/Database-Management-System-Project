const { query } = require('../database');

module.exports.isAdmin = function isAdmin(memberId) {
    const sql = `SELECT * FROM member m JOIN member_role r ON m.role=r.id WHERE m.id = $1 AND role = 2`;
    return query(sql, [memberId])
        .then(function (result) {
            const rows = result.rows;
            console.log(rows, rows.length);
            if (rows.length == 1)
                return true;
            return false;
        })
        .catch(function (error) {
            throw error;
        });
};

module.exports.retrieveByUsername = function retrieveByUsername(username) {
    const sql = 'SELECT * FROM member WHERE username = $1';
    return query(sql, [username]).then(function (result) {
        const rows = result.rows;
        return rows[0];
    });
};

// Task 4
module.exports.getTotalSpending = function getTotalSpending() {
    const sql = 'SELECT * FROM get_total_spending()';
    return query(sql)
}

module.exports.retrieveAgeGroupSpending = function retrieveAgeGroupSpending(gender, minTotalSpending, minMemberTotalSpending) {
    const sql = 'SELECT * FROM get_age_group_spending($1, $2, $3)';
    return query (sql, [gender || null, minTotalSpending || null, minMemberTotalSpending || null]).then (function (result) {
        const rows = result.rows;
        return rows;
    })
};
// End Task 4

module.exports.generateCustomerLifetimeValue = function generateCustomerLifetimeValue() {
    const sql = 'CALL compute_customer_lifetime_value()';
    return query(sql)
        .then(function (result) {
            console.log('Calculating CLV');
        })
        .catch(function (error) {
            throw error;
        });
};

module.exports.getFavouriteSummary = function getFavouriteSummary() {
    const sql = 'SELECT * FROM get_favorites_summary()';
    return query(sql)
        .then(function (result) {
            return result.rows;
        })
        .catch(function (error) {
            throw error;
        });
};