// app/models/item.js
// grab the mongoose module
var mongoose = require('mongoose');

// define our item model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Item', {
    name : 			{type: String, default: 'Item'},
    type : 			{type: String, default: ''},
    brand : 		{type: String, default: ''},
    price : 		{type: Number, default: 0.00},
    description : 	{type: String, default: 'No Description'},
    longDescription:{type: String, default: 'No Description'},
    choices: 		[{name:String, subChoices:[{choice: String, price: Number}]}],
    categories:     [{name:String, subOptions: []}],
    imageSrc:   	{type: String, default: ''}
});