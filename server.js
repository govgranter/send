const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;


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


// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

//Post to send 
app.post('/send', async (req, res) => {
    const { message }  = req.body;
    try {
        const response = await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// API endpoint to SET message
app.post('/set-message', (req, res) => {
    console.log('📨 Received POST data:', req.body);
    
    if (!req.body.message) {
        return res.status(400).json({ error: 'No message provided' });
    }
    
   // const text = req.body.text;

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
