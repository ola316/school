// server.js — minimal API for announcements, events, and uploads
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./db');
const config = require('./config');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Simple admin check (demo only)
function checkAuth(req, res, next){
  const token = req.headers['x-admin-token'];
  if(!token || token !== 'demo-admin-token') return res.status(401).json({error: 'Unauthorized'});
  next();
}

// Announcements
app.get('/api/announcements', (req,res)=>{
  db.all("SELECT * FROM announcements ORDER BY date DESC", (err, rows)=>{
    if(err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});
app.post('/api/announcements', checkAuth, (req,res)=>{
  const {title, content, date} = req.body;
  db.run("INSERT INTO announcements (title,content,date) VALUES (?,?,?)", [title,content,date], function(err){
    if(err) return res.status(500).json({error: err.message});
    res.json({id: this.lastID});
  });
});
app.put('/api/announcements/:id', checkAuth, (req,res)=>{
  const {title, content, date} = req.body;
  db.run("UPDATE announcements SET title=?, content=?, date=? WHERE id=?", [title,content,date, req.params.id], function(err){
    if(err) return res.status(500).json({error: err.message});
    res.json({changes: this.changes});
  });
});
app.delete('/api/announcements/:id', checkAuth, (req,res)=>{
  db.run("DELETE FROM announcements WHERE id=?", [req.params.id], function(err){
    if(err) return res.status(500).json({error: err.message});
    res.json({deleted: this.changes});
  });
});

// Events
app.get('/api/events', (req,res)=>{
  db.all("SELECT * FROM events ORDER BY date DESC", (err, rows)=>{
    if(err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});
app.post('/api/events', checkAuth, (req,res)=>{
  const {title, description, date} = req.body;
  db.run("INSERT INTO events (title,description,date) VALUES (?,?,?)", [title,description,date], function(err){
    if(err) return res.status(500).json({error: err.message});
    res.json({id: this.lastID});
  });
});

// Gallery upload
const uploadDir = path.join(__dirname, '..', 'uploads');
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
  destination: function(req,file,cb){ cb(null, uploadDir); },
  filename: function(req,file,cb){ cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({storage});
app.get('/api/gallery', (req,res)=>{
  db.all("SELECT * FROM gallery ORDER BY uploaded_at DESC", (err, rows)=>{
    if(err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});
app.post('/api/upload', checkAuth, upload.single('file'), (req,res)=>{
  const filename = req.file.filename;
  const caption = req.body.caption || '';
  db.run("INSERT INTO gallery (filename, caption, uploaded_at) VALUES (?,?,?)", [filename, caption, new Date().toISOString()], function(err){
    if(err) return res.status(500).json({error: err.message});
    res.json({id: this.lastID, filename});
  });
});

const PORT = config.PORT || 3000;
app.listen(PORT, ()=> console.log("Server running on port", PORT));
