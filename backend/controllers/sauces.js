const Recipe = require('../models/Recipe');
const Rate = require('../models/Rate');
const fs = require('fs');

exports.createRecipe = (req, res, next) => {
    const recipeObjet = JSON.parse(req.body.sauce);
    delete recipeObjet._id;
    const recipe = new Recipe({
        ...recipeObjet,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        userLiked: [String],
        userDisliked: [String],
    });
    recipe.save()
        .then(() => res.status(201).json({ message: 'Votre recette de sauce a été créé !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.getAllRecipe = (req, res, next) => {
    Recipe.find()
        .then(recipes => res.status(200).json(recipes))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneRecipe = (req, res, next) => {
    Recipe.findOne({ _id: req.params.id })
        .then(recipe => res.status(201).json(recipe))
        .catch(error => res.status(400).json({ error }));
};

exports.modifyRecipe = (req, res, next) => {
    const recipeObjet = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Recipe.updateOne({ _id: req.params.id }, { ...recipeObjet, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
};

exports.deleteRecipe = (req, res, next) => {
    Recipe.findOne({ _id: req.params.id })
      .then(recipe => {
          const filename = recipe.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            recipe.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
                .catch(error => res.status(400).json({ error }));
          });
      })
      .catch(error => res.status(500).json({ error }));
};

exports.likeRecipe = (req, res, next) => {
    const rateObject = JSON.parse(req.body.like);
    const rate = new Rate({
        ...rateObject
    });
    Recipe.findOne({ _id: req.params.id })
        .then(recipe => {
            const rateValue = Number(req.rate.like);
            if (rateValue === 1) {
                for (const [userLiked, userId] of Object.entries(recipe)) {
                    if (!req.rate.userId) {
                        // recipe.likes = JSON.parse(Number(recipe.likes) += rateValue);
                        recipe.userLiked = JSON.parse(rate.userId);
                    };
                };
            };
        })
        .catch(error => res.status(400).json({ error }));
};