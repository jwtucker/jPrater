var mongoose = require('mongoose');

module.exports = mongoose.model('Testimonial', {
    name : 				{type: String, default: 'Anonymous'},
    testimonial : 		{type: String, default: 'Testimonial goes here'},
    date : 				{type: Date, default: Date.now},
    approved : 			{type: Boolean, default: false}
});