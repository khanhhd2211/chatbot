const request = require('request')
function forecasts() {
    request('https://weather-ydn-yql.media.yahoo.com/forecastrss?location=hanoi,vn&format=json&u=c', {
        oauth:{
        consumer_key:'dj0yJmk9NG1PVnJsMXNCSW9rJmQ9WVdrOVNYZEVPVzVxTXpJbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTdh',
        consumer_secret:'5e05f92696b1be097652989f0eed4f762151109f'
        },
        qs:{user_id:'IwD9nj32'} // or screen_name
    }, function (err, res, body) {
        let searchForecasts = JSON.parse(body) 
        console.log(searchForecasts)
    })
}
forecasts()