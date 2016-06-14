// 'nodejsdremkov@mail.ru'-'angular2016'
// ВСЕ ЗПРОСЫ В БАЗУ СДЕЛАТЬ В МОДУЛЕ!!!!!!!!!!!!!!!!!

// ADMINU SDELAT OTDELNII MODUL S funkciami
var express = require("express");
var appServer = express();
var port = process.env.PORT || 3000;
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var bcrypt = require('bcryptjs');
var path = require("path");
var fs = require('fs');
var fse = require('fs-extra');
var mkdirp = require('mkdirp');
var expressSession = require('express-session');
var random = require('./random-JSON-objects.js')
// var io = require('socket.io').listen(port);
var server = require('http').Server(appServer);
var io = require('socket.io')(server);
// server.listen(port);
// var io = require('socket.io');
// var io = io.listen(port);
var socketApp = require('./app_modules/sokcet.io.js') 
//mail to Admin
var sendAdminMail = require('./app_modules/node-mailer.js')
//admin load img
var updateDbImg = require('./app_modules/uploadProductImg.js');
//path for upload img
// var imgAdmin = require
var multer = require('multer');
var upload = {
	avatar : 			multer({ dest : './public/img/avatars/'}),
	small_laptop : 	multer({	dest : './public/img/products/small/laptop'}),
	big_laptop : 		multer({	dest : './public/img/products/big/laptop'}),
	slide1_laptop : 	multer({	dest : './public/img/products/slide1/laptop'}),
	slide2_laptop : 	multer({	dest : './public/img/products/slide2/laptop'}),
	slide3_laptop : 	multer({	dest : './public/img/products/slide3/laptop'}),
	slide4_laptop : 	multer({	dest : './public/img/products/slide4/laptop'}),
	small_tablet : 	multer({	dest : './public/img/products/small/tablet'}),
	big_tablet : 		multer({	dest : './public/img/products/big/tablet'}),
	slide1_tablet : 	multer({	dest : './public/img/products/slide1/tablet'}),
	slide2_tablet : 	multer({	dest : './public/img/products/slide2/tablet'}),
	slide3_tablet : 	multer({	dest : './public/img/products/slide3/tablet'}),
	slide4_tablet : 	multer({	dest : './public/img/products/slide4/tablet'})
}
var setRandomProducts = require('./app_modules/setRandomProducts.js')
//admin analitika (visits site)
//grafiki
var analitikaVisits = require('./app_modules/analitikaVisits.js')
//models
var models = require('./app_modules/models.js')
// config
var config = require('./app_modules/config.js')
// mongoose
var mongoose = require("mongoose");
mongoose.connect(config.urlDbMongo);
mongoose.connection;
var mongooseMethods = require('./app_modules/mongoose-methods.js')
appServer.use(express.static(path.join(__dirname, "public")));
appServer.use(cookieParser());
appServer.use(bodyParser.json());
appServer.use(expressSession({
	secret : 'mySecretCode',
	resave : false,
	saveUninitialized : false
}));


analitikaVisits.inspectServerDate();
analitikaVisits.startServer_createDb();
//запускать один раз для заполнения базы после создания startServer_createDb
// analitikaVisits.setAllArhivRandomValues()
		// USER BEGIN
// #===========================================================	
// ГОТОВО!!!!!!!!!!!!!!!!!!
// io.on('connection', function (socket) {
// 	console.log('1')
// 	// socket.emit('addNewRandomProduct', { 'counter': start });
// });
appServer.post('/inspectSession', 
	function(req, res, next) {
		analitikaVisits.inspectVisits(req);
		if (req.cookies['user.session']) {
			mongooseMethods.findById_(req, next, 'user', req.cookies['user.session']);
		}
		else {res.send()}
	},
		function(req, res, next) {
			if (req.resultFindById) {
				var userDb = req.resultFindById;
				userDb.visits++;
				mongooseMethods.save_(req, next, userDb)
			}
			else {res.send()}
		},
			function(req, res, next) {
				if (req.resultSave) { res.send(req.resultSave)	}
				else { res.send() }
			})
// ГОТОВО!!!!!!!!!
appServer.post('/login', 	
	function(req, res, next) {	
		mongooseMethods.findOne_(req, next, 'user', { "username" : req.body.username })
	},
		function(req, res, next) {
			'use strict';
			var 	userClient,
					salt,
					successPassw,
					userServer;
			userClient = req.body;
			userServer = req.resultFindOne;
			if (userServer) {
				successPassw = bcrypt.compareSync(userClient.password, userServer['password']);
				if (successPassw) {
					if (userClient.username === 'admin') {
						salt = bcrypt.genSaltSync(10);
						userServer.keyAccess = bcrypt.hashSync(String(userServer._id), salt);	
						res.send(userServer)	
					}
					else {
						if (userClient.session) {
							userServer.visits++;
							userServer.session = true;						
							res.cookie('user.session', userServer._id, { maxAge: 7*24*60*60, httpOnly: true })
							userServer.save();
							res.send(userServer)	
						}
						else {
							userServer.visits++;
							userServer.session = false;
							res.cookie('user.session', userServer._id, { maxAge: 0});
							userServer.save();
							res.send(userServer)
						}
					}		
				}
				else {
					res.send("Некорректный пароль")
				}
			}
			else {
				res.send("Некорректный логин")
			}}); 
// ГОТОВО!!!!!!!!!
appServer.post('/registr',
	// test login  
	function(req, res, next) {	
		mongooseMethods.findOne_(req, next, 'user', { 
			"username" : req.body.username 
		})
	},
		//if login free, create new user
		function(req, res, next) {
			var 	newUser,
					newUserDb,
					salt,
					hashPassw,
					commentsUser,
					commentsUserDb;
			if (req.resultFindOne) {
				res.send("логин занят")
			}
			else {
				newUser = new models.user;
				newUser.username = req.body.username;
				salt = bcrypt.genSaltSync(10);
				hashPassw = bcrypt.hashSync(req.body.password, salt);				
				newUser.password = hashPassw;
				newUser.email = req.body.email;
				newUser.rights = "user";
				newUser.visits = 0;
				newUser.session = false;
				newUser.basket = [];
				newUser.comments = [];
				newUser.raitings = [];
				mongooseMethods.save_(req, next, newUser)
			}
		},
			// create db with comments for this user
			function(req, res, next) {
				if (req.resultSave) { 
					newUserDb = req.resultSave;
					commentsUser = {
						'idUser' : newUserDb._id,	
						'comments' : [] 
					};
					commentsUser = new models.comments_users(commentsUser);
					mongooseMethods.save_(req, next, commentsUser)
				}
				else {
					res.send("сбой на сервере, повторите позже")
				}
			},
				//write in user database id database with comments 
				function(req, res, next) {
					if (req.resultSave) {
						commentsUserDb =  req.resultSave;
						newUserDb.commentsId = commentsUserDb._id;
						mongooseMethods.save_(req, next, newUserDb)
					}
					else {
						res.send("сбой на сервере, повторите позже")
					}
				},	
					//send id newUser - for post avatar 
					function(req, res, next) {
						if (req.resultSave) { 
							 res.send({'_id': newUserDb._id}) 
						}
						else {
							 res.send("сбой на сервере, повторите позже") 
						}
					});
// ГОТОВО!!!!!!!!!
appServer.post('/postAvatar', 
	upload.avatar.single('file'),
		function(req, res, next) {	
			mongooseMethods.findById_(req, next, 'user', req.body.id) 
		}, 
			function(req, res, next) {
				if (req.resultFindById) {
					var userDb = req.resultFindById;
					var idAvatar = req.file.filename;
					var typeAvatar = "." + (req.file.mimetype).substring(6);
					var fullNameAvatar = idAvatar + typeAvatar;
					userDb.avatarId = fullNameAvatar;			
					fs.rename('public/img/avatars/' + idAvatar, 'public/img/avatars/' + idAvatar + typeAvatar, function(err) {
					    if ( err ) {	throw err; 	 mail}; //!!!!!!!!!!!!!!!!!!!!!!!!!!!!
					});
					userDb.avatarId = fullNameAvatar;
					mongooseMethods.save_(req, next, userDb)
					res.send({'id': idAvatar})
				}
				else {
					res.send('повторите позже')
				}
			});
// ГОТОВО!!!!!
appServer.post('/setProductBasket',
	function(req, res, next) {
		mongooseMethods.findById_(req, next, 'user', req.body.userId)
	},
		function(req, res, next) {
			if (req.resultFindById) {
				req.resultFindById.basket.push(req.body.product);
				mongooseMethods.save_(req, next, req.resultFindById)
			}
			else {
				res.send({success: false})
			}
		},
			function(req, res, next) {
				if (req.resultSave) { res.send({success: true})	}
				else { res.send({success: false}) }
			});
// ГОТОВО!!!!!!!!!!!!!!!
appServer.post('/deleteUser',
	//remove user from db-users
	function(req, res, next) {
		mongooseMethods.findById_(req, next, 'user', req.body.idUser)
	},
		function(req, res, next) {
			if (req.resultFindById) {
				var userDb = req.resultFindById;
				req.userIdCommentDb = userDb.commentsId;
				req.userIdAvatar = userDb.avatarId;
				mongooseMethods.remove_(req, next, userDb);
				
			}
			else {
				res.send({success: false})
			}
		},
			// remove user from db-comments-user
			function(req, res, next) {
				if (req.resultRemove) { 
					delete req.resultFindById;
					mongooseMethods.findById_(req, next, 'comments_users', req.userIdCommentDb)
				}
				else { res.send({success: false}) }
			},	
				function(req, res, next) {
					if (req.resultFindById) {
						var userCommentsDb =  req.resultFindById;
						delete req.resultRemove
						mongooseMethods.remove_(req, next, userCommentsDb)
					}
					else { res.send({success: false}) }
				},
					//remove avatar user
					function(req, res, next) {
						if (req.resultRemove) { 
							var avatarId = req.userIdAvatar;
							if (avatarId) {
								var pathDeleteImg = './public/img/avatars/' + avatarId;
								fs.unlink(String(pathDeleteImg), function (err) {
									if (err) throw err;
									// mail
									res.send({'success' : true, 'avatar': true})
								});
							}
							else {
								res.send({'success' : true, 'avatar': false})
							}
						}
						else { res.send({success: false}) }
					});
// ГОТОВО!!!!!
appServer.post('/deleteProductBasket', 
	function(req, res, next) {
		mongooseMethods.findById_(req, next, 'user', req.body.userId)
	},
		function(req, res, next) {
			'use strict';
			var arrBasket;
			var arrBasketLength;
			var i;
			var userDb;
			if (req.resultFindById) {
				userDb = req.resultFindById;
				arrBasket = userDb.basket;
				arrBasketLength = arrBasket.length;
				for (i = 0; i < arrBasketLength; i++) {
					if (arrBasket[i]._id === req.body.productId) {
						arrBasket.splice(i, 1)
						break;
					}
				}
				mongooseMethods.save_(req, next, userDb)
			}
			else {res.send({success: false})}
		},
			function(req, res, next) {
				if (req.resultSave) { res.send({success: true})	}
				else { res.send({success: false}) }
			});
//ГОТОВО!!!!!
appServer.post('/setReiting', 
	// save raiting in db product
	function(req, res, next) {
		mongooseMethods.findById_(req, next, req.body.kindProduct, req.body.idProduct)
	},
		function(req, res, next) {
			var productDb;
			var newRaiting;
			if (req.resultFindById) {
				productDb = req.resultFindById;
				productDb.raiting.sum += req.body.raiting;
				productDb.raiting.num += 1;
				newRaiting = (productDb.raiting.sum / productDb.raiting.num).toFixed(2);
				productDb.raiting.val = newRaiting;
				req.productId = productDb._id
				mongooseMethods.save_(req, next, productDb);
			}
			else {
				res.send({'success' : false})
			}
		},
			//save raiting in db user
			function(req, res, next) {
				if (req.resultSave) {
					mongooseMethods.findById_(req, next, 'user', req.body.idUser)
				}
				else {res.send({'success' : false})}
			},
				function(req, res, next) {
					if (req.resultFindById) {
						var userDb = req.resultFindById;
						userDb.raitings.push(req.productId)
						mongooseMethods.save_(req, next, userDb)
					}
					else {res.send({'success' : false})}
				},
					function(req, res, next) {
						if (req.resultSave) {
							res.send({'success' : true})
						}
						else {res.send({'success' : false})}
					})
//ГОТОВО!!!!!
appServer.get('/logOut', 
	function(req, res) {
		res.cookie('user.session', { maxAge: 0})
		res.send({"deleteCookie":true})
	});
appServer.get('/getStartData', function(req, res) {
	'use strict'
	var 	data = {};
	models.tablet.find(function(err, tablet) {		
		if (err) {
			res.send("ошибка на сервере!<br>перезагрузите страницу");
		}
		else {
			data['tablet'] = tablet;
			models.brends.find(function(err, allBrends) {
				if (err) {
					res.send("ошибка на сервере!<br>перезагрузите страницу");
				}
				else {
					data['allBrends'] = allBrends;
					models.minAndMaxVal.find(function(err, valMinMax) {
						if (err) {
							res.send("ошибка на сервере!<br>перезагрузите страницу");
						}
						else {
							data['valMinMax'] = valMinMax;
							res.send(data);
						}
					})
				}
			})	
		}
	})		
});
appServer.get('/getLaptop', function(req,res) {
	models.laptop.find(function(err,docs) {
		res.send(docs);
	})
});
appServer.post('/getComments', function(req, res) {
	var db = "comments_" + req.body.db;
	var idComments = req.body.idComments;
	models[db].findById(idComments, function(err, doc) {
		if (err) {
			throw err;
			// mail
		}
		if (doc) {
			res.send(doc.comments)
		}
	})
});
// ГОТОВО!!!!!!!!!!!!!!
appServer.post('/setComment',
	//db-comments for this product . find product
	function(req, res, next) {
		mongooseMethods.findById_(req, next, "comments_" + req.body.kindProduct, req.body.idComments)
	},	
		//db-comments for this product . add comment
		function(req, res, next) {
			if (req.resultFindById) {
				var thisProductComments = req.resultFindById;
				thisProductComments.comments.push({
					'user' : req.body.user,
					'dateMilisec' : req.body.milisec,
					'text' : req.body.text
				});
				mongooseMethods.save_(req, next, thisProductComments)
				delete req.resultFindById;
			}
			else {res.send({success:false})}
		},
			//db-product : find product
			function(req, res, next) {
				if (req.resultSave) {
					mongooseMethods.findById_(req, next, req.body.kindProduct, req.body.idProduct)
					delete req.resultSave;
				}
				else {res.send({success:false})}
			},	
				//db-product : increment summ comments
				function(req, res, next) {
					if (req.resultFindById) {
						var dbProduct = req.resultFindById
						dbProduct.comments.summ++;
						mongooseMethods.save_(req, next, dbProduct)
						delete req.resultFindById;
					}
					else {res.send({success:false})}
				},
					// db-comments-user : find note this user
					function(req, res, next) {
						if (req.resultSave) {
							mongooseMethods.findById_(req, next, 'comments_users', req.body.idCommentsUser)
							delete req.resultSave;
						}
						else {res.send({success:false})}
					},
						// db-comments-user : add comment to db-comments this user
						function(req, res, next) {
							if (req.resultFindById) {
								var dbCommentsUser = req.resultFindById;
								dbCommentsUser.comments.push({
									'product' : req.body.idProduct,
									'productKind' : req.body.kindProduct,
									'dateMilisec' : req.body.milisec,
									'text' : req.body.text
								})
								mongooseMethods.save_(req, next, dbCommentsUser)
								delete req.resultFindById;
							}
							else {res.send({success:false})}
						},
							//send success message
							function(req, res, next) {
								if (req.resultSave) {
									res.send({success:true})
								}
								else {res.send({success:false})}
							});
// #===========================================================
		// USER END



		// ADMIN BEGIN
// #===========================================================

// analitikaVisits.createDb_Visits_startServer();
// analitikaVisits.setArhivVisits();


//ГОТОВО!!!!!!!!!!!!!!!!!
appServer.get('/getAnalitikaDb',
	// find arhiv month 
	function(req, res, next) {
		mongooseMethods.findAll_(req, next, 'analitikaYear')
	},
		// find present month
		function(req, res, next) {
			if (req.resultFindAll) {
				req.yearAnalitika = req.resultFindAll;
				mongooseMethods.findAll_(req, next, 'analitikaMonth')
			}
			else {
				res.send({error:true})
			}
		},
			function(req, res, next) {
				if (req.resultFindAll) {
					res.send({
						'presentMonth' : req.resultFindAll,
						'arhiv' : req.yearAnalitika
					})
				}
				else {
					res.send({error:true})
				}
			})

//ГОТОВО!!!!!!!!!!!!!!!!!
appServer.post('/deleteComment', 
	function(req, res, next) {
		mongooseMethods.findById_(req, next, 'comments_users', req.body.idCommentsDb)
	},
		function(req, res, next) {
			'use strict';
			var objCommentsThisUser;
			var arrCommentsThisUser;
			var idThisCommentDb;
			var idDeletedComment = '"' + req.body.idDeletedComment + '"';
			var index;
			var i;
			if (req.resultFindById) {
				objCommentsThisUser = req.resultFindById;
				arrCommentsThisUser = objCommentsThisUser.comments;
				for (i = 0; i < arrCommentsThisUser.length; i++) {
					idThisCommentDb = JSON.stringify(arrCommentsThisUser[i]._id)
					if (idThisCommentDb === idDeletedComment) {
						index = i;
						break;
					}
				}
				if (index || index == 0) {
					arrCommentsThisUser.splice(index, 1)
					mongooseMethods.save_(req, next, objCommentsThisUser)
				}
				else {
					res.send({'success' : false});
				}
			}
			else {res.send({success:false})}
		},
			function(req, res, next) {
				if (req.resultSave) {
					res.send({'success' : true})
				}
				else {res.send({'success' : false})}
			})
//ГОТОВО!!!!!!!!!!!!!!!!!
appServer.post('/deleteAvatar', 
	function(req, res, next) {
		mongooseMethods.findById_(req, next, 'user', req.body.idUser)
	},
		function(req, res, next) {
			if (req.resultFindById) {
				var userDb = req.resultFindById;
				req.idAvatar = userDb.avatarId
				userDb.avatarId = undefined;
				mongooseMethods.save_(req, next, userDb)
			}
			else {res.send({success:false})}
		},
			function(req, res, next) {
				if (req.resultSave) {
					var idAvatar = req.idAvatar;
					pathDeleteImg = './public/img/avatars/' + idAvatar;
					fs.unlink(String(pathDeleteImg), function (err) {
						if (err) throw err;
						// mail
						res.send({'success' : true})
					});	
				}
				else {res.send({'success' : false})}
			})
//ГОТОВО!!!!!!!!!!!!!!!!!
appServer.post('/getGroupUsers', 
	function(req, res, next) {
		mongooseMethods.findAll_(req, next, 'user')
	},
		function(req, res, next) {
			if (req.resultFindAll) {
				var allUsers = req.resultFindAll;
				var numAllUsers = allUsers.length;
				var page = req.body.page;
				var usersInView = req.body.viewNum;
				var begin = (page - 1) * usersInView;
				var end = begin + usersInView;
				var postedUsers = allUsers.slice(begin, end)
				res.send({
					'numberAllUsers' :  numAllUsers,
					'usersView' : postedUsers
				})
			}
		})
//ГОТОВО!!!!!!!!!!!!!!!!!
appServer.post('/getCurrentUserComments', 
	function(req, res, next) {
		mongooseMethods.findById_(req, next, 'comments_users', req.body.idCommentsDb)
	},
		function(req, res, next) {
			if (req.resultFindById) {
				res.send(req.resultFindById.comments)
			}
		})

// ГОТОВО!!!!!!!!!!!!!!!!!!!
appServer.post('/deleteProduct',
	//find
	function(req, res, next) {
		mongooseMethods.findById_(req, next, req.body.productType, req.body.id)
	},	//remove main db
		function(req, res, next) {
			if (req.resultFindById) {
				req.idComments = req.resultFindById.comments.idComments;
				req.kindProduct = req.resultFindById.kind;
				req.allImgJSON = JSON.stringify(req.resultFindById.img);
				mongooseMethods.remove_(req, next, req.resultFindById)
			}
			else {res.send({success : false})}
		},
			function(req, res, next) {
				if (req.resultRemove) {
					mongooseMethods.findById_(req, next,'comments_' + req.kindProduct, req.idComments)
				}
				else {res.send({success : false})}
			},	
				//remove db with comments
				function(req, res, next) {
					if (req.resultFindById) {

						mongooseMethods.remove_(req, next, req.resultFindById)
					}
					else {res.send({success : false})}
				},
					//remove images
					function(req, res, next) {
						var allImg;
						if (req.resultRemove) {
							allImg = JSON.parse(req.allImgJSON);
							for(key in allImg) {
								pathDeleteImg = './public/img/products/' + String(key) + '/' + req.kindProduct + "/" + String(allImg[key]);
								fs.unlink(String(pathDeleteImg), function (err) {
									if (err) {
										throw err;
										sendAdminMail(err)
									}
								})
							}
							res.send({success : true})
						}
						else { res.send({success : false})}
					})


appServer.post('/editProduct', function(req, res) {
	'use strict';
	var id = req.body.id;
	var typeProduct = req.body.productType;
	models[typeProduct].findById(id, function(err, doc) {
		if (err) {
			throw err;
			// mail
		}
		else {
			res.send(doc)
		}
	})
})
appServer.post('/getDbAdmin', function(req, res) {
	// console.log('da')
	// var nameDb = "shortDb_" + req.body.nameDb;
	// console.log(nameDb)
	models[req.body.nameDb].find({}, function(err, data) {
		// console.log(data)
		if (err) {
			throw err
			res.send('пусто')
		};
		// mail
		res.send(data)
	})
})
appServer.get('/getNumberDbProducts', 
	function(req, res, next) {
		mongooseMethods.findAll_(req, next, 'tablet')
	},
		function(req, res, next) {
			if (req.resultFindAll) {
				req.numDbProducts = {'tablet' : req.resultFindAll.length}
				delete req.resultFindAll;
			}
			else {
				res.send('false')
			}
			mongooseMethods.findAll_(req, next, 'laptop')
		},
			function(req, res, next) {
				if (req.resultFindAll) {
					req.numDbProducts.laptop = req.resultFindAll.length;
					res.send(req.numDbProducts)
				}
				else {
					res.send('false')
				}
			})
// ГОТОВО!!!!!!!!!!!!!!
// WORK clear product and comments db
appServer.post('/clearProductCommentsImageDb', function(req, res) {
	'use strict';
	var counter = 0;
	var interval;
	var arrDbName = ['laptop', 'tablet', 'comments_laptop', 'comments_tablet'];
	var i;
	var pathTablet;
	var pathLaptop;
	var arrKindImg = ['small', 'big', 'slide1', 'slide2', 'slide3', 'slide4']
	for (i = 0; i < arrDbName.length; i++) {
		models[arrDbName[i]].remove({}, function(err, doc) {
			if (err) {
				throw err;
				sendAdminMail(err)
			}
			counter++
		})
	}	
	interval = setInterval(function() {
		if (counter == arrDbName.length) {
			clearInterval(interval)
			for (i = 0; i < arrKindImg.length; i++) {
				pathTablet = './public/img/products/' + arrKindImg[i] + '/tablet'; 
				pathLaptop = './public/img/products/' + arrKindImg[i] + '/laptop';
				fse.emptyDir(pathTablet, function (err) {
					if (err) {sendAdminMail(err)}
				})
				fse.emptyDir(pathLaptop, function (err) {
					if (err) {sendAdminMail(err)}
				}) 
			}
			res.send({success:true})	
		} 
	},200)	
})
// WORK add random  products
appServer.post('/setRandomsProductDb', function(req, res, next) {
	
	setRandomProducts.saveRandomProducts(req, res, next, models, random, io)
})

// 	product = req.body;
// 	kindProduct = product.kind;
// 	productDb = new models[kindProduct](product);
// 	nameDb = "comments_" +  kindProduct;
// 	productDb.save(function(err, doc) {
// 		if (err) throw err;
// 			// mail
// 		if(doc) {

// 			commentsDb = new models[nameDb]({
// 				'idProduct' : doc._id,
// 				'comments' : []	
// 			});
// 			commentsDb.save(function(err, comDb) {
// 				if (err) throw err;
// 				// mail
// 				if (comDb) {
// 					// res.send({id : doc._id})


// 					// =================СЛУЧАЙНЫЕ КОММЕНТАРИИ НЕ УДАЛЯТЬ!!!!!!!!!!=====================
// 					arrComments = random.randomComments;
// 					// console.log(arrComments)
// 					//кол-во коментов
// 					// var randomValue = (Math.ceil(Math.random()*15));
// 					var randomValue = 1;
// 					// console.log(randomValue)
// 					//c какой позиции начать
// 					var randomStart = (Math.ceil(Math.random()*180));
// 					// console.log(randomStart)
// 					for (var i = randomStart; i < (randomStart+randomValue); i++) {
// 						// console.log(arrComments[i])
// 						commentsDb.comments.push(arrComments[i])
// 					}
					
// 					commentsDb.save();
// 					// console.log(commentsDb.comments)
// 					productDb.comments = {
// 						'summ' : 0,
// 						'idComments' : comDb._id
// 					}
// 					productDb.save(function(err, data) {
// 						if (err) throw err;
// 						// mail
// 						res.send({id : doc._id})
// 					})
// 				}
// 			})
// 		}
// 	})
// });
//	add new product to DataBase
appServer.post('/setProductDb', 
	function(req, res, next) {
	'use strict'
	var 	product,
			productDb,
			commentsDb,
			kindProduct,
			nameDb,
			arrComments;
	
	product = req.body;
	kindProduct = product.kind;
	productDb = new models[kindProduct](product);
	nameDb = "comments_" +  kindProduct;
	productDb.save(function(err, doc) {
		if (err) throw err;
			// mail
		if(doc) {

			commentsDb = new models[nameDb]({
				'idProduct' : doc._id,
				'comments' : []	
			});
			commentsDb.save(function(err, comDb) {
				if (err) throw err;
				// mail
				if (comDb) {
					// res.send({id : doc._id})


					// =================СЛУЧАЙНЫЕ КОММЕНТАРИИ НЕ УДАЛЯТЬ!!!!!!!!!!=====================
					arrComments = random.randomComments;
					// console.log(arrComments)
					//кол-во коментов
					// var randomValue = (Math.ceil(Math.random()*15));
					var randomValue = 1;
					// console.log(randomValue)
					//c какой позиции начать
					var randomStart = (Math.ceil(Math.random()*180));
					// console.log(randomStart)
					for (var i = randomStart; i < (randomStart+randomValue); i++) {
						// console.log(arrComments[i])
						commentsDb.comments.push(arrComments[i])
					}
					
					commentsDb.save();
					// console.log(commentsDb.comments)
					productDb.comments = {
						'summ' : 0,
						'idComments' : comDb._id
					}
					productDb.save(function(err, data) {
						if (err) throw err;
						// mail
						res.send({id : doc._id})
					})
				}
			})
		}
	})
});

appServer.post('/setImgAdmin_small_laptop',    upload.small_laptop.single('file'), function(req, res) {	updateDbImg(req, res)});
appServer.post('/setImgAdmin_big_laptop',   	  upload.big_laptop.single('file'), function(req, res) {	updateDbImg(req, res)});
appServer.post('/setImgAdmin_slide1_laptop',   upload.slide1_laptop.single('file'), function(req, res) {	updateDbImg(req, res)});
appServer.post('/setImgAdmin_slide2_laptop',   upload.slide2_laptop.single('file'), function(req, res) {	updateDbImg(req, res)});
appServer.post('/setImgAdmin_slide3_laptop',   upload.slide3_laptop.single('file'), function(req, res) {	updateDbImg(req, res)});
appServer.post('/setImgAdmin_slide4_laptop',   upload.slide4_laptop.single('file'), function(req, res) {	updateDbImg(req, res)});
appServer.post('/setImgAdmin_small_tablet',    upload.small_tablet.single('file'), function(req, res) {	updateDbImg(req, res)});
appServer.post('/setImgAdmin_big_tablet',   	  upload.big_tablet.single('file'), function(req, res) {	updateDbImg(req, res)});
appServer.post('/setImgAdmin_slide1_tablet',   upload.slide1_tablet.single('file'), function(req, res) {	updateDbImg(req, res)});
appServer.post('/setImgAdmin_slide2_tablet',   upload.slide2_tablet.single('file'), function(req, res) {	updateDbImg(req, res)});
appServer.post('/setImgAdmin_slide3_tablet',   upload.slide3_tablet.single('file'), function(req, res) {	updateDbImg(req, res)});
appServer.post('/setImgAdmin_slide4_tablet',   upload.slide4_tablet.single('file'), function(req, res) {	updateDbImg(req, res)});

appServer.get('/getUsers', function(req, res) {
	models.shortDbUsers.find({}, function(err, doc) {
		if (err) throw err;
		if (err) {sendAdminMail(err)};
		if (doc) {
			res.send(doc)
		}
	})
})

// #===========================================================
		// ADMIN END










		// WORK POSTS
//#======================================================



//перенос в архив
// appServer.get('/setDayARHIV', function(req, res) {
// 	console.log('1')
// })
// appServer.get('/setMonthARHIV', function(req, res) {
// 	console.log('2')
// })
// appServer.get('/setYearARHIV', function(req, res) {
// 	console.log('3')
// })
// // удаление архивов!!!!
// appServer.get('/removeDayARHIV', function(req, res) {
// 	models.analitikaDay.find({}, function(err, data) {
// 		if (data[0]) {data[0].remove()}
// 	})
// })
// appServer.get('/removeMonthARHIV', function(req, res) {
// 	models.analitikaMonth.find({}, function(err, data) {
// 		if (data[0]) {data[0].remove()}
// 	})
// })
// appServer.get('/removeYearARHIV', function(req, res) {
// 	models.analitikaYear.find({}, function(err, data) {
// 		if (data[0]) {data[0].remove()}
// 	})
// })
	// appServer.get('/deleteUsers', function(req, res) {
	// 	models.user.find({}, function(err, data) {
	// 		var length = data.length;
	// 		for (var i = 0; i < length; i++) {
	// 			if (data[i].username !== 'admin') {
	// 				data[i].remove();
	// 			}
	// 		}
	// 		models.shortDbUsers.find({}, function(err, db) {
	// 			var length = db.length
	// 			for (var i = 0; i < length; i++) {
	// 				db[i].remove()
	// 			}
	// 		});
	// 	})
	// })
	// appServer.get('/addRandomUsers', function(req, res) {
	// 	var numUsers,
	// 		newUser,
	// 		salt,
	// 		hashPassw,
	// 		shortDbUser;
	// 	numUsers = 20;
	// 	for (var i = 0; i < numUsers; i++) {
	// 		newUser = new models.user;
	// 		newUser.username = i;
	// 		salt = bcrypt.genSaltSync(10);
	// 		hashPassw = bcrypt.hashSync('a' + String(i), salt);				
	// 		newUser.password = hashPassw;
	// 		newUser.email = 'email' + String(i);
	// 		newUser.rights = "user";
	// 		newUser.visits = 0;
	// 		newUser.session = false;
	// 		newUser.basket = "objekt";
	// 		newUser.comments = "objekt";
	// 		newUser.reitings = "objekt";
	// 		newUser.prevStateApp = "objekt"; 
	// 		newUser.avatarId = false;
	// 		newUser.save(function(err, doc) {
	// 			if (err) throw err;
	// 			// sendAdminMail(err);
	// 			if (doc) {
	// 				shortDbUser = new models.shortDbUsers;;
	// 				shortDbUser.id_db = doc._id;
	// 				shortDbUser.login_db = doc.username;
	// 				shortDbUser.save()
	// 			}
	// 		})
	// 	}
	// })

	// SAVE user BEGIN
		// var user__ = {
		// 	"username" : "user",
		// 	"password" : "user",
		// 	"email" : "user@user.com",
		// 	"rights" : "user",
		// 	"visits" : 5,
		// 	"session" : false,
		// 	"basket" : {asdas : true},
		// 	"comments" : {asdas : true},
		// 	"reitings" : {asdas : true},
		// 	"prevStateApp" : {asdas : true}
		// }
		// var newUser__ = new models['user'](user__);
		// newUser__.save();
	// SAVE user

	// SAVE MINMAXVALUE BEGIN
		// перед продакшн убрать значения
		// var minMax = {
		// 	tablet :	{
		// 		processor : {min : 1, max : 10},
		// 		display : {min : 4, max : 19},
		// 		memory : {min : 2, max : 11}
		// 	},
		// 	laptop : {
		// 		processor : {min : 50, max : 100},
		// 		display : {min : 40, max : 190},
		// 		memory : {min : 20, max : 110}
		// 	}
		// }
		// var minAndMaxSave = new models['minAndMaxVal'](minMax);
		// minAndMaxSave.save();
	// SAVE MINMAXVALUE END


	// SAVE ALLBRENDS BEGIN
		// проверка  при запросе - docs['tooltip']['brend'] - true underfind
		// var eee = {
		// 	laptop : {
		// 		laptop1 : true,
		// 		laptop2 : true,
		// 		laptop3 : true
		// 	},
		// 	tablet : {
		// 		tablet1 : true,
		// 		tablet2 : true,
		// 		tablet3 : true
		// 	}
		// }
		// var allBrends = new models['brends'](eee);
		// allBrends.save();
	// SAVE ALLBRENDS END


	// SAVE NEW GOODS BEGIN
	//!!!!!!!! BUTTONS!!!!!!!!!!!!!!!!
		// appServer.get('/setWorkDb', function(req,res) {
		// 	console.log('da')
		// 	var arrTablet = [
		// 		{
		// 		"type" : "tablet",	
		// 			"brend" : "tablet",
		// 			"model" : "1",
		// 			"img":"1",
		// 			"reiting": {
		// 				"sum":5,
		// 				"num":5
		// 			}
		// 		},
		// 		{
		// 			"type" : "tablet",
		// 			"brend" : "tablet",
		// 			"model" : "2",
		// 			"img":"2",
		// 			"reiting": {
		// 				"sum":25,
		// 				"num":7
		// 			},
		// 			"stock" : {
		// 				"stockVal" : 5,
		// 				"stockInfo" : "stockInfo"
		// 			} 
		// 		}
		// 	]
		// 	var arrLaptop = [
		// 		{
		// 			"type" : "laptop",
		// 			"brend" : "laptop",
		// 			"model" : "1",
		// 			"img":"3",
		// 			"reiting": {
		// 				"sum":25,
		// 				"num":10
		// 			}
		// 		},
		// 		{
		// 			"type" : "laptop",
		// 			"brend" : "laptop",
		// 			"model" : "2",
		// 			"img":"4",
		// 			"reiting": {
		// 				"sum":1,
		// 				"num":1
		// 			}
		// 		}
		// 	];
		// 	function setDbMongoLab(arrProducts, typeProduct, length) {
		// 		'use strict'
		// 		var	randomNumber,
		// 				pathRandomImgSmall,
		// 				pathRandomImgBig,
		// 				pathNewImgSmall,
		// 				pathNewImgBig,
		// 				dirImgBig,
		// 				dirImgSmall,
		// 				arrLength,
		// 				i,
		// 				newProduct;
		// 				console.log('da')
		// 		arrLength = Number(length);
		// 		for (i = 0; i < arrLength; i++) {
		// 			newProduct = new models[typeProduct](arrProducts[0]);
		// 			//reiting value
		// 			newProduct.reiting.val = (newProduct.reiting.sum/newProduct.reiting.num).toFixed(1);
		// 			newProduct.save();
		// 			//create dir for big image for this product (name dir - id this product)
		// 			dirImgBig = "public/img/big_img/" + typeProduct + "/" + newProduct._id;
		// 			mkdirp(dirImgBig, function(err) {console.log(err)});
		// 			//create dir for small image for this product (name dir - id this product)
		// 			dirImgSmall = "public/img/small_img/" + typeProduct + "/"  + newProduct._id;
		// 			mkdirp(dirImgSmall, function(err) {console.log(err)});
		// 			randomNumber = Math.ceil(((Math.random()).toFixed(2))/2*10);
		// 			//copy in new dir random big image
		// 			pathRandomImgBig = "public/img/constantBig/" + typeProduct + "/" + randomNumber + ".png";
		// 			pathNewImgBig = dirImgBig + "/bigImg.png";
		// 			fse.copy(pathRandomImgBig, pathNewImgBig, function (err) {
		// 				if (err) return console.error(err)
		// 					console.log("success!")
		// 			});
		// 			//copy in new dir random small image
		// 			pathRandomImgSmall = "public/img/constantSmall/" + typeProduct + "/" + randomNumber + ".png";
		// 			pathNewImgSmall = dirImgSmall + "/smallImg.png";
		// 			fse.copy(pathRandomImgSmall, pathNewImgSmall, function (err) {
		// 				if (err) return console.error(err)
		// 					console.log("success!")
		// 			});
		// 		};
		// 	}
		// 	setDbMongoLab(arrTablet, "tablet", "10");
		// 	setDbMongoLab(arrLaptop, "laptop", "15");	
		// });
	// SAVE NEW GOODS END
//#======================================================
		// WORK POSTS


server.listen(port);
console.log('server port - 3000');

// 'use strict';
	// var newItemBasket = req.body.product;
	// // console.log(newItemBasket)
	// models.user.findById(req.body.userId, function(err, userDb) {
	// 	if (err) {
	// 		throw err;
	// 		// mail
	// 	}
	// 	if (userDb) {
	// 		userDb.basket.push(req.body.product)
	// 		userDb.save(function(err,doc) {
	// 			if (err) {
	// 				throw err;
	// 				// mail
	// 			}
	// 			if (doc) {
	// 				res.send({success: true})
	// 			}
	// 		})
	// 	}
	// })
// appServer.post('/postProductBasket', function(req, res) {
// 	'use strict';
// 	var newItemBasket = req.body.product;
// 	// console.log(newItemBasket)
// 	models.user.findById(req.body.userId, function(err, userDb) {
// 		if (err) {
// 			throw err;
// 			// mail
// 		}
// 		if (userDb) {
// 			userDb.basket.push(req.body.product)
// 			userDb.save(function(err,doc) {
// 				if (err) {
// 					throw err;
// 					// mail
// 				}
// 				if (doc) {
// 					res.send({success: true})
// 				}
// 			})
// 		}
// 	})
// });
// appServer.post('/login', function(req, res) {
// 	var userClient = req.body;
// 	var salt;
// 	var successPassw;
// 	var salt;
// 	models.user.findOne({ "username" : userClient.username }, function(err, userServer) {
// 		if (err) throw (err);
// 		if (!userServer) {
// 			res.send("Некорректный логин")
// 		}
// 		else {
// 			successPassw = bcrypt.compareSync(userClient.password, userServer['password']);
// 			if (!successPassw) {	
// 				res.send("Некорректный пароль")
// 			}
// 			else {
// 				if (userClient.username === 'admin') {
// 					//на клиенте запускается счетчик времени бездействия через 15 мин.
// 					salt = bcrypt.genSaltSync(10);
// 					userServer.keyAccess = bcrypt.hashSync(String(userServer._id), salt);	
// 					res.send(userServer)	
// 				}
// 				else {
// 					if (userClient.session) {
// 						userServer.session = true;						
// 						res.cookie('user.session', userServer._id, { maxAge: 7*24*60*60, httpOnly: true })
// 						userServer.save();
// 						res.send(userServer)	
// 					}
// 					else {
// 						userServer.session = false;
// 						res.cookie('user.session', userServer._id, { maxAge: 0});
// 						userServer.save();
// 						res.send(userServer)
// 					}
// 				}	
// 			}
// 		}
// 	});
// });

