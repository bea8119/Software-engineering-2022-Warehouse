/* Database initialization */

const sqlite = require('sqlite3');

const dbname = 'Prova';
const db = new sqlite.Database(dbname, (err) => { if (err) throw err; });

module.exports = {
    db: db, 
};

