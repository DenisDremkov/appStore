// var passport = require('passport')
var localStrategy = require('passport-local').Strategy;
var models = require('../models.js');



// module.exports = function(passport) {

// 	// берет у найденного юзера ид и помещает его в сессию в ответ!!!! назад клиенту req.session.passport.user // как только уйдет ответ по клиент по результатам проверки логина то и сразу кука запишется
// 	passport.serializeUser(function(user, done) {
// 		console.log('serialize')
// 		done(null, user._id)
// 	});

// 	// берет из функции сериализации ид и находит по нему обьект нашего юзера и возвращает его как // второй аргумент в post
	
// 	// берет из полученной куки и ищет в монгоклиента по id
// 	passport.deserializeUser(function(id, done) {
// 		models.user.findById(id, function(err, user) {	
// 			console.log('deserialize find')
// 			console.log(user)
// 			done(null, user);

// 		});
// 	});
// 	passport.use('local', new localStrategy({
// 			usernameField : 'username',
// 			passwordField : 'password',
// 			passReqToCallbacc : true   //дает доступ к переданным в запросе всем полям
// 		},
// 		function(req, username, password, done) {
// 			// находим обьект в базе и если все  он возвращаем его
// 			console.log('strategy')
// 			models.user.findOne({ "username" : username }, function(err, user) {
// 				console.log('strategy find')
// 				if (err) {
// 					console.log('strategy find err')			
// 					return done(err); 
// 				}
// 				if (!user) {
// 					console.log('strategy find no user')
// 					return done(null, null, req.flash('signup_mes', ))
// 				}
// 				if (password !== user['password']) {
// 					console.log('strategy find wrong passw')
// 					return done(null, null)
// 				}
// 				console.log('strategy return user')
// 				console.log(user)
// 				return done(null, user);
// 			});
// 		}
// 	));
	
// }