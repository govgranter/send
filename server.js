const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// MIDDLEWARE - This is crucial!
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Store the message
let currentMessage = 'Waiting for a message...';

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sender.html'));
});

app.get('/receiver', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'receiver.html'));
});

// API endpoint to SET message
app.post('/set-message', (req, res) => {
    console.log('Received message:', req.body);
    currentMessage = req.body.message || 'Empty message';
    console.log('Message stored:', currentMessage);
    res.json({ success: true, message: 'Message received!' });
});

// API endpoint to GET message
app.get('/get-message', (req, res) => {
    res.json({ message: currentMessage });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📤 Sender: http://localhost:${PORT}`);
    console.log(`📥 Receiver: http://localhost:${PORT}/receiver`);
});
