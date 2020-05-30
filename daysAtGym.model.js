var mongoose = require('mongoose');
var Schema = require('mongoose');
var DaysAtGymSchema = new Schema({
	daysAtGym: Number
}, {
	versionKey: false
})

var DaysAtGym = mongoose.model('DaysAtGym', DaysAtGymSchema, 'day');

module.exports = DaysAtGym;
