var mongoose = require('mongoose');
var DaysAtGymSchema = new mongoose.Schema({
	daysAtGym: String
})

var DaysAtGym = mongoose.model('DaysAtGym', DaysAtGymSchema, 'day');

module.exports = DaysAtGym;
