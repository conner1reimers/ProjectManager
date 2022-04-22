const mysql       = require('mysql');

let db = {
    host     : '127.0.0.1',
    user     : 'root',
    port     : '3306',
    database : 'testdb',
    password : "password"
    
};

// Might be a problem in the future
const connection = mysql.createConnection(db);


async function query(sql) {
    //const connection = mysql.createConnection(db);

    return await (new Promise(function (resolve, reject) { 
        connection.query(sql, (error, results, fields) => {
            if(error) {
                console.log(error);
                resolve(undefined);
            }
            resolve(results); 
        });
    }));
}

function beginTransaction(cb) {
    connection.beginTransaction(cb);
}
function rollback() { connection.rollback(); }

function commit() { connection.commit(); }

module.exports = {
    query: query,
    beginTransaction: beginTransaction,
    rollback: rollback,
    commit: commit
};