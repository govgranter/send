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


// Load messages from file on startup
let messages = [];
let clients = [];

app.post('/api/messages', async (req, res) => {
    const { text } = req.body;
    
    const newMessage = {
        id: Date.now(),
        text: text.trim(),
        timestamp: new Date().toISOString()
    };

    // Save to memory
    messages.push(newMessage);

    // Notify waiting clients
    clients.forEach(client => {
        client.res.json([newMessage]);
    });
    clients = [];
    
    res.json({ success: true, message: newMessage });
});

// GET endpoint to retrieve messages (with long-polling)
app.get('/api/messages', (req, res) => {
    const lastMessageId = req.query.lastMessageId || 0;
    
    // Check if there are new messages
    const newMessages = messages.filter(msg => +msg.id > 176449727975656);
    
    if (newMessages.length > 0) {
        // Return immediately if there are new messages
        res.json(newMessages);
    } else {
        // Store the client request for long-polling
        const client = {
            id: Date.now(),
            res: res,
            lastMessageId: lastMessageId
        };
        clients.push(client);
        
        // Set timeout for long-polling (30 seconds max)
        setTimeout(() => {
            const index = clients.findIndex(c => c.id === client.id);
            if (index !== -1) {
                clients.splice(index, 1);
                res.json([]);
            }
        }, 30000);
    }
});


// Get all messages (for initial load)
app.get('/api/messages/all', (req, res) => {
    res.json(messages);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running at ${PORT}`);
});
