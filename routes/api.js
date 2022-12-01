var express = require('express');
var router = express.Router();
var librosModel = require ('./../models/librosModel');
var cloudinary = require ('cloudinary').v2;

router.get('/plus' , async function(req, res, next){
    let libros = await librosModel.getLibros();

    libros = libros.map(libros => {
        if (libros.img_id){
            const image =cloudinary.url(libros.img_id, {
                width:50,
                height: 100,
                crop: 'fill'
            });
            return {
                ...libros,
                image
            }
        } else {
            return {
                ...libros,
                image: ''
            }
        }
    });
    res.json(libros);
});

module.exports = router;