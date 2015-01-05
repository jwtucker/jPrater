// app/models/item.js
// grab the mongoose module
var mongoose = require('mongoose');

// define our item model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Item', {
    name : {type : String, default: ''},
    brand : {type: Array, default: []}
});