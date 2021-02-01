const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    userLiked: { type: Object, required: true },
    userDisliked: { type: Object, required: true }
}, { autoIndex: false });

module.exports = mongoose.model('Recipe', recipeSchema);