const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favDishSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish',
        required: true
    }
},
{
    timestamps:true
}
);

const favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    dishes: [favDishSchema]
},
{
    timestamps:true
}
);

var Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;