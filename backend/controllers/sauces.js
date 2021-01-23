const Recipe = require('../models/Recipe');
const fs = require('fs');

exports.createRecipe = (req, res, next) => {
    const recipeObject = JSON.parse(req.body.sauce);
    delete recipeObject._id;
    const recipe = new Recipe({
        ...recipeObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0
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
    const recipeObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Recipe.updateOne({ _id: req.params.id }, { ...recipeObject, _id: req.params.id })
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
    Recipe.findOne({ _id: req.params.id })
        .then(sauce => {
            switch (req.body.like) {
                case -1:
                    sauce.dislikes = sauce.dislikes + 1;
                    sauce.userDisliked.push(req.body.userId);
                    sauceObject = {
                        "dislikes": sauce.dislikes,
                        "userDisliked": sauce.userDisliked
                    }
                    break;
                case 0:
                    if (sauce.userDisliked.find(user => user === req.body.userId)) {
                        sauce.userDisliked = sauce.userDisliked.filter(user => user !== req.body.userId);
                        sauce.dislikes = sauce.dislikes - 1;
                        sauceObject = {
                            "dislikes": sauce.dislikes,
                            "userDisliked": sauce.userDisliked
                        }
                    } else {
                        sauce.userLiked = sauce.userLiked.filter(user => user !== req.body.userId);
                        sauce.likes = sauce.likes - 1;
                        sauceObject = {
                            "likes": sauce.likes,
                            "userLiked": sauce.userLiked
                        }
                    }
                    break;
                case +1:
                    sauce.likes = sauce.likes + 1;
                    sauce.userLiked.push(req.body.userId);
                    sauceObject = {
                        "likes": sauce.likes,
                        "userLiked": sauce.userLiked
                    }
                    break;
                default:
                    return res.status(500).json({ error });
            }
            Recipe.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce liké !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(() => res.status(400).json({ error: 'Sauce non trouvée !' }));
};