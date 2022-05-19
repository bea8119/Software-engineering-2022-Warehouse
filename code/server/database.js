/* Database initialization */

const sqlite = require('sqlite3');

const dbname = 'Prova';
const db = new sqlite.Database(dbname, (err) => { if (err) throw err; });
db.run("PRAGMA foreign_keys=ON");

module.exports = {
    db: db, 
};

