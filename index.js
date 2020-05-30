const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
    console.log('Running on port: ' + PORT)
})

app.get('/', function(req, res) {
    res.send('Hi, i\'m a chatbot');
})
app.get('/webhook/', function(req, res) {
    if (req.query['hub.verify_token'] === 'nhanvanchatbot') {
        res.send(req.query['hub.verify_token']);
    }
    res.send('Wrong token');
})