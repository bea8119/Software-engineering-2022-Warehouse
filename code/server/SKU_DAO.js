'use strict';

class SKU_DAO{
    sqlite=require('sqlite3');
    constructor(dbname){
        this.db = new this.sqlite.Database(dbname, (err) => { if(err) throw err;});
    }

    dropTable(){

    }

    newTableName(){
        return new Promise((resolve, reject) => {
            const sql= 'CREATE TABLE IF NOT EXISTS SKU( id INTEGER PRIMARY KEY AUTOINCREMENT,  description VARCHAR(20), weight INTEGER,  volume INTEGER, notes VARCHAR(20), availableQuantity INTEGER, price REAL)';
            this.db.run(sql, (err) => { if(err) {
                reject(err); 
                return;
            }
            resolve(this.lastID);
        });
        
        });
    }

    storeSKU(data) {
        return new Promise ((resolve, reject) => {
        const sql = 'INSERT INTO SKU (id,  description, weight, volume, notes, availableQuantity, price) VALUES (?, ?, ?, ? ,? ,? ,?)';
        this.db.run(sql, [data.id,  data.description, data.weight,  data.volume, data.notes, data.availableQuantity, data.price], (err) => {
        if (err) {
        reject(err);
        return;
        }
        resolve(this.lastID);
        });
        });
    }

    getStoredSKU() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM SKU';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const skus = rows.map((r) => (
                    {
                        id: r.id,
                        description: r.description,
                        weight: r.weight,
                        volume: r.volume,
                        notes : r.notes,
                        availableQuantity: r.availableQuantity,
                        price: r.price
                    }
                ));
            resolve(skus);
        });
    });
}
}

module.exports = SKU_DAO;
