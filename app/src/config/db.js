const mysql = require("mysql");

let pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PSWORD,
    database: process.env.DB_DATABASE,

});

function getConnection(callback){
    pool.getConnection(function (err, conn){
        if(!err) {
            callback(conn);
        }
    });
}

//db.connect();


module.exports = getConnection;
