const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads with more permissive settings
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = './uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Keep original extension
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + ext);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

const app = express();
const PORT = 3000;

// MIDDLEWARE - Fix for CORS and JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Add CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Store the message
let currentMessage = 'No message yet';

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sender.html'));
});

app.get('/receiver', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'receiver.html'));
});

// API endpoint to SET message
app.post('/set-message', (req, res) => {
    console.log('📨 Received POST data:', req.body);
    
    if (!req.body.message) {
        return res.status(400).json({ error: 'No message provided' });
    }
    if (req.body.text) {
    text = req.body.text;
    }
    currentMessage = req.body.message;
    console.log('💾 Message stored:', currentMessage);
    
    res.json({ 
        success: true, 
        message: 'Message received!',
        received: currentMessage
    });
});

// API endpoint to GET message
app.get('/get-message', (req, res) => {
    console.log('📤 Sending message:', currentMessage);
    res.json({ 
        message: currentMessage,
        text: text,
        timestamp: new Date().toISOString()
    });
});

// Test endpoint
app.get('/test', (req, res) => {
    res.json({ status: 'Server is working!' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📤 Sender: http://localhost:${PORT}`);
    console.log(`📥 Receiver: http://localhost:${PORT}/receiver`);
    console.log(`🧪 Test: http://localhost:${PORT}/test`);
});
