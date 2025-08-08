// init_db.js — creates tables and inserts sample data
const db = require('./db');
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    date TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    date TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT,
    caption TEXT,
    uploaded_at TEXT
  )`);
  db.run(`INSERT INTO announcements (title, content, date) VALUES (?,?,?)`, ["Welcome Back!", "School reopens on Sep 1. Please check the timetable.", "2025-09-01"]);
  db.run(`INSERT INTO events (title, description, date) VALUES (?,?,?)`, ["Sports Day", "Annual sports competition.", "2025-10-12"]);
  console.log("Database initialized with sample data.");
  process.exit(0);
});
