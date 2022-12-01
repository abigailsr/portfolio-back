var express = require('express');
var router = express.Router();
var librosModel = require('../../models/librosModel');
var util = require ('util');
var cloudinary = require ('cloudinary').v2;
var uploader = util.promisify(cloudinary.uploader.upload);
var destroy = util.promisify(cloudinary.uploader.destroy);


router.get('/', async function(req, res, next) {
  var libros = await librosModel.getLibros();

libros = libros.map(libro =>{
  if(libro.img_id){
    const image = cloudinary.image(libro.img_id, {
      width:60,
      height:100,
      crop: 'fill'
    });
    return {
      ...libro,
      image
    }
  } else {
    return {
      ...libro,
      image: ''
    }
  }
});

  res.render('admin/plus', {
    libros
  });
});

/**diseño de add */
router.get('/add', async function(req, res, next) {

  res.render('admin/add', {
    
  });
});

/*insert libro */
router.post('/add', async (req, res, next) =>{
  try{

    var img_id = '';
    //console.log(req.files.image);
    if (req.files && Object.keys(req.files).length > 0){
      image = req.files.image;
      img_id = (await uploader (image.tempFilePath)).public_id;
    }

    if (req.body.title != '' && req.body.gender !='' && req.body.author != ''){
      await librosModel.insertLibro({
        ...req.body,
        img_id
      });
      res.redirect('/admin/plus')
    } else{
      res.render('admin/add', {
        error:true,
        message: 'All fields are required'
      })
    }
  } catch (error){
    console.log(error)
    res.render('admin/add', {
      error: true,
      message: 'Book not loaded'
    })
  }
})

/*Delete libro */
router.get('/delete/:id' , async(req, res, next) =>{
  var id = req.params.id;
  let libro = await librosModel.getLibrosByID(id);
  if(libro.img_id){
    await(destroy(libro.img_id));
  }

  await librosModel.deleteLibro(id);
  res.redirect('/admin/plus')
});

/*modificar la vista con formulario y los datos cargados */
router.get('/modify/:id', async (req,res,next) =>{
  var id = req.params.id;
  //console.log(req.params.id);
  var  libro = await librosModel.getLibrosByID(id);

  res.render('admin/modify' , {
    libro
  })
});

/*Actualizacion */
router.post ('/modify' , async (req,res, next) =>{
  try{
      var img_id = req.body.img_original;
      var delete_old_img = false;

      if(req.body.img_delete === '1'){
        img_id = null;
        delete_old_img = true;
      } else {
        if( req.files && Object.keys(req.files).length > 0){
          image = req.files.image;
          img_id = (await uploader(image.tempFilePath)).public_id;
          delete_old_img = true;
        }
      }
      if(delete_old_img && req.body.img_original){
        await (destroy(req.body.img_original));
      }

    var obj = {
      title: req.body.title,
      gender: req.body.gender,
      author: req.body.author,
      img_id
    }
    
    await librosModel.modifyLibroById(obj, req.body.id);
    res.redirect('/admin/plus');

  } catch (error) {
    console.log(error) 
    res.render('admin/modify' , {
      error: true,
      message: 'The book was not modified'
    })
  }
})

module.exports = router;
