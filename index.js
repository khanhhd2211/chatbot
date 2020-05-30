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
    if (req.query['hub.verify_token'] === 'khanhchatbot') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Wrong token');
})
app.post('/webhook/', function(req, res) {
    let messaging_events = req.body.entry[0].messaging_events
    for (let i = 0; i < messaging_events.length; i++) {
        let event = messaging_events[i];
        let sender = event.sender.id;
        if (event.message && event.message.text) {
            let text = event.message.text;
            sendText(sender, `Text echo ${text.substring(0, 100)}`)
        }
    }
    res.sendStatus(200)
})

function sendText(sender, text) {
    let messageData = {text}
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: {access_token: "EAAEvpJTMNgkBAFRxqM2nmIi4mrHsq6PW2xqwpqfQJHb08BkC4NN3baBAUcw8KS8PtiTEFiul4SZC2oyvPmZBBcqrGqdZAFdR2Mj83NZAWwvTj5jZCN6hlVwdEPoYxcAA3nqmpI20Wm5BU9GFVZC51Ik6hHNH3qX0tIxh1lHaC97y1eARVHZCQYT"},
        method: "POST",
        json: {
            recipient: {id: sender},
            message: messageData
        }, function(err, res) {
            if (err) {
                console.log('sending error')
            } else if (res.body.error) {
                console.log('response body error')
            }
        }
    })
}