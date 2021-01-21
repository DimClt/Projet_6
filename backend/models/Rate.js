const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const rateSchema = mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    rating: { type: Number, required: true, unique: true },
});

rateSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Rate', rateSchema);