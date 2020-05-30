var mongoose = require('mongoose');
var DaysAtGymSchema = new mongoose.Schema({
	daysAtGym: Number
})

var DaysAtGym = mongoose.model('DaysAtGym', DaysAtGymSchema, 'day');

module.exports = DaysAtGym;
