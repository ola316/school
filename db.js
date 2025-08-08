const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbFile = path.join(__dirname, 'school.db');
const db = new sqlite3.Database(dbFile);
module.exports = db;
