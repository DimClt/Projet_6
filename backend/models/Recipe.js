const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
    // id: {},
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    userLiked: { type: String, required: false },
    userDisliked: { type: String, required: false },
});

module.exports = mongoose.model('Recipe', recipeSchema);