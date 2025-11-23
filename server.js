const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Store the current message
let currentMessage = '';

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sender.html'));
});

app.get('/receiver', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'receiver.html'));
});

// Set message endpoint
app.post('/set-message', (req, res) => {
    currentMessage = req.body.message || '';
    console.log('Message set:', currentMessage);
    res.json({ success: true });
});

// Get message endpoint
app.get('/get-message', (req, res) => {
    res.json({ message: currentMessage });
});

app.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`);
});
