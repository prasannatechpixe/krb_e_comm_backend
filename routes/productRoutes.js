const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const imageupload = require('../middlewares/productimageuploader');
const pdfUpload = require('../middlewares/pdfuploader');

// Product routes
router.post('/getall', productController.getAllProducts);
router.post('/byid/:id', productController.getProductById);
router.post('/add', imageupload.array('images', 10), productController.createProduct);
router.put('/productmanualupload', pdfUpload.single('manual'), productController.productManual);
router.put('/updateproduct', imageupload.array('images', 10), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/searchProduct', productController.productSearch);

module.exports = router;