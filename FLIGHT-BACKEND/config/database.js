// const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

// const mysql = require('mysql');

// // Create a connection pool
// var con = mysql.createConnection({
//     host: DB_HOST, user: DB_USERNAME, database: DB_NAME, password: DB_PASSWORD
// });

// con.connect(function (err) {
//     if (err) throw err;
//     console.log("Connected!");
// });

// function executeQuery(sql, values, callback) {
//     con.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log("Result: " + result);
//     });
// }
// module.exports = {
//     executeQuery
// };