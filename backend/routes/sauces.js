const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const saucesCtrl = require('../controllers/sauces');

router.post('/', auth, multer, saucesCtrl.createRecipe);
router.get('/', saucesCtrl.getAllRecipe);
router.get('/:id', auth, saucesCtrl.getOneRecipe);
router.put('/:id', auth, saucesCtrl.modifyRecipe);
router.delete('/:id', auth, saucesCtrl.deleteRecipe);
router.post('/:id/like', saucesCtrl.likeRecipe);

module.exports = router;