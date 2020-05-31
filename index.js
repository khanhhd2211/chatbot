var express = require('express')
 var bodyParser = require('body-parser')
 var request = require('request')
 var app = express()
 
 app.set('port', (process.env.PORT || 5000))
 
 // Process application/x-www-form-urlencoded
 app.use(bodyParser.urlencoded({extended: false}))
 
 // Process application/json
 app.use(bodyParser.json())
 
 //
 var mongoose = require('mongoose');
 mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
 var daysAtGym = require('./daysAtGym.model');
 // Index route
 app.get('/', function (req, res) {
     res.send('Hello world, I am a chat bot')
 })
 
 // for Facebook verification
 app.get('/webhook/', function (req, res) {
     if (req.query['hub.verify_token'] === 'khanhchatbot') {
         res.send(req.query['hub.challenge'])
     }
     res.send('Error, wrong token')
 })
 
 // Spin up the server
 app.listen(app.get('port'), function() {
     console.log('running on port', app.get('port'))
 })
 app.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging
  for (i = 0; i < messaging_events.length; i++) {
      event = req.body.entry[0].messaging[i]
      sender = event.sender.id
      if (event.message && event.message.text) {
          text = event.message.text.substring(0, 200)
          if (text === '/help') {
            sendTextMessage(sender,'/hello\n/weather + day + location,country\n/goodbye\n/gym\n/up + number')
          } else if (text === '/hello') {
            sendTextMessage(sender, 'Chào bạn! tôi là Kbot hân hạn được làm quen với bạn')
          } else if (text === '/weather') {
            sendTextMessage(sender, 'Tính năng này hiện tại chưa được hỗ trợ')
          } else if (text === '/goodbye') {
            sendTextMessage(sender, 'Tạm biệt :3')
          } else if (text === '/gym') {
            checkDay(sender);
          } else if (text.split(' ')[0] === '/up') {
            updateDay(sender, text.split(' ')[1]);
          } else if (text.split(' ')[0] === '/weather') {
            if (!text.split(' ')[1]) {
              forecasts(sender, 0, text.split(' ')[2])
            } else {
              forecasts(sender, parseInt(text.split(' ')[1]), text.split(' ')[2])
            }
          }
      }
  }
  res.sendStatus(200)
})

var token = "EAAEmJVLT904BANWTCOXOUrZCmZC3R6sZCewbpQDBHmXFLuFyUA48wIzVZC0kPdc1TCtWsWPuBHTlhknB7jIHhmK8Yp5dO0bFZAl8GNCgrJX9ZADkLjqN5Mbm9ZAz2JVZCRhYLUxgOObM7KObLNxhv2ZCs5Bfkuoq9JWRSso7th6NIAXzA7EZAnXs08"

async function checkDay(sender) {
  var gym = await daysAtGym.find()
  sendTextMessage(sender, `Bạn đã tập gym được ${gym[0].daysAtGym} ngày`)
}

async function updateDay(sender, days) {
  var gym = await daysAtGym.find()
  newdays = gym[0].daysAtGym + parseInt(days || '0')
  await daysAtGym.updateOne({ _id: '5ed26b84e7179a6b6365ac10' }, { daysAtGym: newdays })
  sendTextMessage(sender, 'Đã cập nhật số ngày tập gym, bạn cứ tiếp tục cố gắng nhá <3')
}

function forecasts(sender, day, locat) {
  request(`https://weather-ydn-yql.media.yahoo.com/forecastrss?location=${locat}&format=json&u=c`, {
      oauth:{
      consumer_key:'dj0yJmk9NG1PVnJsMXNCSW9rJmQ9WVdrOVNYZEVPVzVxTXpJbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTdh',
      consumer_secret:'5e05f92696b1be097652989f0eed4f762151109f'
      },
      qs:{user_id:'IwD9nj32'} // or screen_name
  }, function (err, res, body) {
      let searchForecasts = JSON.parse(body) 
      let data = searchForecasts.forecasts[day]
      let date = '';
      for (let i = 0; i < 3; i++) {
        date += Date(data.date).split(' ')[i] + ' ' 
      }
      sendTextMessage(
        sender, 
        `Vị Trí: ${searchForecasts.location.city}, ${searchForecasts.location.country}\nDate: ${date}\nTrạng thái: ${data.text}\nNhiệt độ: ${data.low}-${data.high}`
      )
  })
}

function sendTextMessage(sender, text) {
  messageData = {
      text:text
  }
  request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:token},
      method: 'POST',
      json: {
          recipient: {id:sender},
          message: messageData,
      }
  }, function(error, response, body) {
      if (error) {
          console.log('Error sending messages: ', error)
      } else if (response.body.error) {
          console.log('Error: ', response.body.error)
      }
  })
}