// const db = require('../database'); // Original: db instance was directly required

// Modified for testability: db is now an argument to each function.
// Controllers will need to import the actual 'db' from '../database'
// and pass it as the first argument to these helper functions.

const runQuery = (db, sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) { // 'this' context of function(err) refers to statement
            if (err) {
                console.error('DB Run Error:', err.message, 'SQL:', sql, 'Params:', params);
                reject(err);
            } else {
                // For INSERT/UPDATE/DELETE, this.lastID and this.changes are relevant.
                // this.lastID is for AUTOINCREMENT PKs on INSERT.
                // this.changes is the number of rows affected.
                resolve({ lastID: this.lastID, changes: this.changes });
            }
        });
    });
};

const getQuery = (db, sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                console.error('DB Get Error:', err.message, 'SQL:', sql, 'Params:', params);
                reject(err);
            } else {
                resolve(row); // row is the single result object, or undefined if no match
            }
        });
    });
};

const allQuery = (db, sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                console.error('DB All Error:', err.message, 'SQL:', sql, 'Params:', params);
                reject(err);
            } else {
                resolve(rows); // rows is an array of result objects
            }
        });
    });
};

module.exports = {
    runQuery,
    getQuery,
    allQuery,
};
