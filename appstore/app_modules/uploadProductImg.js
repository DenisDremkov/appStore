var models = require('./models.js')
var fs = require('fs');
module.exports = function(req, res) {
	'use strict'
	var 	idProduct,
			kindImg,
			typeDb,
			idImg,
			typeFile,
			fullNameImg;

	idProduct = req.body.id;
	kindImg = req.body.kindImg;
	typeDb = req.body.typeDb;
	idImg = req.file.filename;
	typeFile = "." + (req.file.mimetype).substring(6);
	models[typeDb].findById(idProduct, function(err, productDb) {
		// if (err) mail
		if (productDb) {
 
			fullNameImg = idImg + typeFile;
					
			fs.rename('public/img/' + kindImg +"/" + idImg, 'public/img/' + kindImg +"/" + idImg + typeFile, function(err) {
			    // mail
			    if ( err ) console.log('ERROR: ' + err); //!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			});
			productDb.img[kindImg] = fullNameImg;	
			// productDb.avatarId = fullNameAvatar;
			productDb.save(function(err,doc) {
				if (err)
					throw err;
				// mail
				if (doc) {
					res.send({'kindImg': kindImg})
				} 
			});
		}
	})
}