

// функция большая поэтому описание = в каждом основном цикле идет добавление новой записи в бд,
// 1. сначала сохраняется сам продукт,
// 2. создается запись в бд комментариев для данного товара
// 3. в бд комментариев добавляются случайное колличество комментариев из готовой базы (файл - ), стартовая позиция тоже случайная
// 4. база комментариев сохраняется.
// 5. в базу комментариев записывается ид продукта а в базу с самим продуктом ид базы комментариев для быстрого поиска в дальнейшем
// 6. после из готовой базы фотографий случайно берутся изображения и присваиваются имена и копии данных изображений данному текущему продукту в цикле.
// 7. при добавлении фотографий запускается вотчер, который при добавлении всех фотографий данного товара в цикле увеличивает основной счетчик на 1, что сигнализирует об успешном добавлении всех баз и фотографий данного продукта
// 8. главный вотчер следит за основным счетчиком, который как только станет равным количеству товаров отпрват ответ пользователю
// !!!!!!!!!!!!!!!9. время ожидания пропорционально количеству товаров!!!!!!!!!!!!!!!!!!!!!!
var fse = require('fs-extra');
var saveRandomProducts = function(req, res, next, models, random, io) {
	'use strict'
	var 	productDb,
			commentsDb,
			nameDb_comments,
			arrComments,
			start,
			randomStart,
			i,
			allRandomProducts,
			numberProducts,
			end,
			pathImg,
			pathImgConstant,
			randomValue,
			counterAddImg,
			thisNameImg,
			arrNameImg, 
			delta,
			counter;
	arrNameImg = ['small', 'big', 'slide1', 'slide2', 'slide3', 'slide4']		
	numberProducts = req.body.number;
	allRandomProducts = random.randomProducts;
	start = Math.floor(Math.random()*(allRandomProducts.length - numberProducts));
	end = Number(start) + Number(numberProducts);
	delta = end - start;
	
	function addNewProduct() {
		productDb = new models[allRandomProducts[start].kind](allRandomProducts[start]);
		//save db product + create db comments + push random comments
		productDb.save(function(err,saveProduct) {
			if (err) {
				throw err;
				sendAdminMail(err)
			}
			// console.log('save prod 1')
			nameDb_comments = "comments_" +  saveProduct.kind;
			commentsDb = new models[nameDb_comments]({
				'idProduct' : saveProduct._id,
				'comments' : []	
			});
			arrComments = random.randomComments;
			randomValue = Math.floor(Math.random()*15);
			randomStart = (Math.ceil(Math.random()*180));
			for (i = randomStart; i < (randomStart+randomValue); i++) {
				commentsDb.comments.push(arrComments[i])
			}
			// save in db product - id db comments and number comments
			commentsDb.save(function(err, saveCommDb) {
				// console.log('save comments')
				productDb.comments = { 
					'summ' : saveCommDb.comments.length,
					'idComments' : saveCommDb._id
				}
				// +++++++++++++++++
				counterAddImg = 6;
				function addImg() {
					thisNameImg = arrNameImg[counterAddImg - 1]
					randomValue = Math.ceil(Math.random()*4)
					pathImgConstant = './public/img/constants/' + thisNameImg + '/' + saveProduct.kind + '/' + randomValue + '.png';
					pathImg = './public/img/products/' + thisNameImg + '/' + saveProduct.kind + '/' + saveProduct._id + '.png';
					fse.copy(pathImgConstant, pathImg, { replace: false }, function (err) {
						if (err) {
							throw err;
							sendAdminMail(err)
						}
						productDb.img[thisNameImg] = productDb._id + '.png';
						counterAddImg--
						if (counterAddImg) {
							addImg()
						}
						else {
							productDb.save(function(err,saved) {
								counter = end - start;
								io.emit('addNewRandomProduct',  {
									'counter' : counter, 
									'delta' : delta,
									'kind' : productDb.kind
								});
								start++
								// !!!!!!!!!!!!!!!!!SOCCKETи в удалении баз тоже + обьяснить пользователю что долго так как копируются фотографии генерятся продукты, комментарии и устанавливаются связи между коллекциями

								if (start == end) {
									res.send({success:true})
								}
								else {
									addNewProduct()
								}
							})
						}
					})
				}
				if (counterAddImg) {
					addImg()
				}	
			}) 
		})
	}
	if (start != end) {
		addNewProduct()
	}
}

module.exports = {
	'saveRandomProducts' : saveRandomProducts
}