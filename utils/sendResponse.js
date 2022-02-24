const express = require('express');
const path = require('path');

const app = express();

const sendResponse = app.get('/verify/:email/:token', (req, res) => {
    res.sendFile(path.join(__dirname, '/verification-success.html'));
})

module.exports = sendResponse;