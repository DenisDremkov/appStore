

var models = require('./models.js');
var sendAdminMail = require('./node-mailer.js')
//==================create db (day, month, year) for analitic=====================
function createDb(nameDb, noteDb) {
	'use strict';
	function createNoteDb() {
		'use strict';
		var 	newNote;	
		newNote = new models[nameDb](noteDb);
		return newNote;
	}
	models[nameDb].find({}, function(err, data) {
		'use strict';
		var newDb;
		if (err) {
			throw err;
			sendAdminMail(err)
		};
		if (!data[0]) {
			newDb = createNoteDb();
			newDb.save(function(err, resultSave) {
				if (err) {
					throw err;
					sendAdminMail(err)
				}
			})
		}
	})
}
var createDb_startServer = function () {
	createDb('analitikaDay', {
		"day" : new Date().getDate(),
		"visits" : 0,
		"uniqVisits" : 0,
		"ipArray" : []	
	})
	createDb('analitikaMonth', {
		"month" : new Date().getMonth(),
		"visits" : 0,
		"uniqVisits" : 0,
		"days" : []	//json 
	})
	createDb('analitikaYear', {
		"year" : new Date().getFullYear(),
		"months" : [] //json 
	})
};
// =================inspect server date for transfer data in arhiv========================================
var inspectServerDate = function () {
	'use strict'
	var	startServerDate,
			todayServerDate,
			yesterday,
			transferMonth;
	startServerDate = (new Date).getDate();
	todayServerDate = (new Date).getDate();
	setInterval(function() {
		yesterday = todayServerDate;
		todayServerDate = (new Date).getDate();

		if (todayServerDate !== yesterday) {
			if (todayServerDate < startServerDate) {
				transferMonth = true;
				setDayInArhiv(transferMonth)
				startServerDate = 1;
				yesterday = 1;
				todayServerDate = 1;
			}
			else {
				transferMonth = false;
				setDayInArhiv(transferMonth)
				yesterday = todayServerDate;
			}
		}	
	}, 1000)
};
//==================set 1.day in arhiv(month), 2. month in arhiv(year) /// 00:00 time - action=====================
function setDayInArhiv (transferMonth) {	
	models.analitikaDay.find({}, function(err, dataDay) {
		'use strict';
		var 	newDb_day,
				oldDb_day,
				oldDay_arhiv = {},
				db_month,
				date,
				thisDayForArhiv;
		if (err) {throw err;	sendAdminMail(err)}
		if (dataDay[0]) {
			oldDb_day = dataDay[0];
			//transfer day in month
			models.analitikaMonth.find({}, function(err, dataMonth) {
				'use strict';
				if (err) {throw err;	sendAdminMail(err)};
				if (dataMonth[0]) {
					dataMonth[0].visits += oldDb_day.visits;
					dataMonth[0].uniqVisits += oldDb_day.uniqVisits;
					oldDay_arhiv.day = oldDb_day.day;
					oldDay_arhiv.visits = oldDb_day.visits;
					oldDay_arhiv.uniqVisits = oldDb_day.uniqVisits;
					dataMonth[0].days.push(oldDay_arhiv);
					dataMonth[0].save(function(err, save) {
						'use strict';
						if (err) {throw err;	sendAdminMail(err)}
						// clear db day
						if (save) {
							oldDb_day.day = new Date().getDate();
							oldDb_day.visits = 0;
							oldDb_day.uniqVisits = 0;
							// oldDb_day.ipArray.length = 0;
							oldDb_day.save(function(err, save) {
								'use strict';
								if (err) {throw err;	sendAdminMail(err)}
								// if month end - transfer month in year
								if (transferMonth) {
									console.log('transferMonthInYear')
									// transferMonthInYear()
								}
							})
						}
					})
				}
			})
		}
	})	
};

// запустить один раз перед продакшн
// случайные значения включительно по сегодняшний или вчерашний день
var setAllArhivRandomValues = function  () {	
	'use strict';
	var objDay;
	var thisMonth;
	var dayinMonth;
	var i;
	var j;
	var summVisitsMonth = 0;
	var summUniqVisitsSumm = 0;
	var arrMonth = [31, 28, 31, 30, 31, 30]
	var arrMonthDays;
	var arrYear = [];
	var arrYearJSON = [];
	var thisMonthJSON;
	var todayDate;
	var yearDb;
	var monthDb;
	var daysThisMonth;
	for (i = 0; i <  arrMonth.length; i++) {
		dayinMonth = arrMonth[i];
		summVisitsMonth = 0
		summUniqVisitsSumm = 0
		arrMonthDays = [];
		//create all days for this month
		for (j = 0; j < dayinMonth; j++) {
			objDay = {};
			objDay.day = j;
			objDay.visits = Math.ceil(Math.random() * 20) + 150;
			summVisitsMonth += objDay.visits;	
			objDay.uniqVisits =  Math.ceil(Math.random() * 20) + 100;
			summUniqVisitsSumm += objDay.uniqVisits
			arrMonthDays.push(objDay)	
		}
		//summ visits and summ uniq visits
		thisMonth = {};
		thisMonth.month = i;
		thisMonth.visits = summVisitsMonth;
		thisMonth.uniqVisits = summUniqVisitsSumm;
		thisMonth.days = arrMonthDays;
		thisMonthJSON = JSON.stringify(thisMonth)
		arrYear.push(thisMonth)
		arrYearJSON.push(thisMonthJSON)
	}
	models.analitikaYear.find({}, function(err, yearDb) {
		//не учитываем текущий месяц. будет потом добавлен
		for (i = 0; i < (arrYearJSON.length - 1 ); i++) {
			yearDb[0].months.push(arrYearJSON[i])
		}
		yearDb[0].save(function(err, saveYear) {
			//save may
			if (saveYear) {
				models.analitikaMonth.find({}, function(err, data) {
					if (data[0]) {
						monthDb = data[0];
						todayDate = new Date().getDate() - 1;
						daysThisMonth = arrYear[5].days.splice(0, todayDate)
						monthDb.month = new Date().getMonth();
						summVisitsMonth = 0;
						for (i = 0; i < daysThisMonth.length; i++) {
							summVisitsMonth += daysThisMonth[i].visits
						}
						monthDb.visits = summVisitsMonth;
						summUniqVisitsSumm = 0;
						for (i = 0; i < daysThisMonth.length; i++) {
							summUniqVisitsSumm += daysThisMonth[i].uniqVisits
						}
						monthDb.uniqVisits = summUniqVisitsSumm
						for (var i = 0; i < daysThisMonth.length; i++) {
							monthDb.days.push(daysThisMonth[i])
						}
						monthDb.save(function(err,save) {
							if (save) {
								// console.log(save)
							}
						})
					}
				})
			}
		})
	})
}

// var inspectServerDate = function () {
// 	'use strict'
// 	var	startServerDate,
// 			todayServerDate,
// 			yesterday;
// 	startServerDate = (new Date).getDate();
// 	todayServerDate = (new Date).getDate();
// 	setInterval(function() {
// 		yesterday = todayServerDate;
// 		todayServerDate = (new Date).getDate();
// 		if (todayServerDate !== yesterday) {
// 			//день в архив месяца
// 			setDayInArhiv()
// 			yesterday = todayServerDate;
// 		}
// 		if (todayServerDate < startServerDate) {
// 			// setMonthInArhiv()
// 			//месяц в архив года
// 			startServerDate = 1;
// 		}
// 	}, 1000)
// };
var inspectVisits = function(req) {
	'use strict'
	var 	db,
			// date,
			// todayDate,
			ipClient,
			ipArr,
			ipArrLength,
			i,
			uniqClient = true;
	ipClient = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	// date = (new Date());
	// todayDate = String(date.getDate());
	models.analitikaDay.find({}, function(err, data) {
		if (err) {
			throw err;
			sendAdminMail(err)
		};
		if (data[0]) {
			db = data[0];
			db.visits++;
			ipArr = db.ipArray;
			ipArrLength = db.ipArray.length;
			for (i = 0; i < ipArrLength; i++) {
				if (ipArr[i] === ipClient) {
					uniqClient = false;
					break;
				}
			}
			if (uniqClient) {
				db.uniqVisits++;
				db.ipArray.push(ipClient);
			}
			db.save(function(err,save) {
				if (err) {throw err;	sendAdminMail(err)}
			})
		}
	})
};

module.exports = {
	"startServer_createDb" : createDb_startServer,
	"inspectVisits" : inspectVisits,
	"setAllArhivRandomValues" : setAllArhivRandomValues,
	"inspectServerDate" : inspectServerDate
	// "setDayInArhiv" : setDayInArhiv
	// "createDbVisits" : createDb,
	// "setArhivVisits" : setArhiv
}



// function createNewDb_day() {
// 	'use strict';
// 	var 	newDb_day;	
// 	newDb_day = new models.analitikaDay({
// 		"day" : new Date().getDate(),
// 		"visits" : 0,
// 		"uniqVisits" : 0,
// 		"ipArray" : []	
// 	});
// 	return newDb_day;
// }
// function createNewDb_month() {
// 	'use strict';
// 	var 	newDb_month;	
// 	newDb_month = new models.analitikaMonth({
// 		"month" : new Date().getMonth(),
// 		"visits" : 0,
// 		"uniqVisits" : 0,
// 		"days" : []	
// 	});
// 	return newDb_month;
// }
// function createNewDb_year() {
// 	'use strict';
// 	var 	newDb_year;	
// 	newDb_year = new models.analitikaYear({
// 		"year" : new Date().getFullYear(),
// 		"months" : [] //json 
// 	});
// 	return newDb_year;
// }

	// switch (nameDb) {
	// 	case 'analitikaDay':
	// 		date = new Date().getDate()
	// 		break;
	// 	case 'analitikaMonth':
	// 		date = new Date().getMonth()
	// 		break;
	// 	case 'analitikaYear':
	// 		date = new Date().getFullYear()
	// 		break;
	// }

	// //create 'today db' if 'today db' is empty
	// models.analitikaDay.find({}, function(err, data) {
	// 	'use strict';
	// 	var newDb_day;
	// 	if (err) {
	// 		throw err;
	// 		sendAdminMail(err)
	// 	};
	// 	if (!data[0]) {
	// 		newDb_day = createNewDb_day();
	// 		newDb_day.save(function(err, resultSave) {
	// 			if (err) {
	// 				throw err;
	// 				sendAdminMail(err)
	// 			}
	// 		})
	// 	}
	// })
	// //create 'today db' if 'today db' is empty
	// models.analitikaMonth.find({}, function(err, data) {
	// 	'use strict';
	// 	var newDb_month;
	// 	if (err) {
	// 		throw err;
	// 		sendAdminMail(err)
	// 	};
	// 	if (!data[0]) {
	// 		newDb_month = createNewDb_month();
	// 		newDb_month.save(function(err, resultSave) {
	// 			if (err) {
	// 				throw err;
	// 				sendAdminMail(err)
	// 			}
	// 		})
	// 	}
	// })
	// models.analitikaYear.find({}, function(err, data) {
	// 	'use strict';
	// 	var newDb_year;
	// 	if (err) {
	// 		throw err;
	// 		sendAdminMail(err)
	// 	};
	// 	if (!data[0]) {
	// 		newDb_year = createNewDb_month();
	// 		newDb_year.save(function(err, resultSave) {
	// 			if (err) {
	// 				throw err;
	// 				sendAdminMail(err)
	// 			}
	// 		})
	// 	}
	// })




// function setMonthInArhiv (req) {
// 	models.analitikaMonth.find({}, function(err, data) {
// 		'use strict'
// 		if (err) throw err;
// 		var 	newDb,
// 				oldDb,
// 				date;
// 		if (data[0]) {
// 			newDb = new models.analitikaMonth;
// 			oldDb = data[0];
// 			date = (new Date());
// 			newDb.month = String(date.getMonth()) + "-" + String(date.getFullYear());
// 			newDb.visits = oldDb.visits;
// 			newDb.uniqVisits = oldDb.uniqVisits;
// 			var dayJSON = JSON.stringify(oldDb.days)
// 			console.log()
// 			// newDb.days.push(JSON.stringify(oldDb.days));
// 			console.log(newDb)
// 			newDb.save(function(err) {
// 				if (err) {
// 					console.log(err)
// 					throw err;
// 				}
// 			});
// 			oldDb.remove(function(err) {
// 				if (err) {
// 					console.log(err)
// 					throw err;
// 				}
// 			});
// 		}
// 	})	
// };


// function creatDbDay() {
// 	models.analitika.find({}, function(err, data) {
// 		'use strict'
// 		// if (err)
// 		var 	newDb,
// 				oldDb
// 				date
// 				day,
// 				visits,
// 				uniqVisits;
// 		if (!data[0]) {
// 			date = (new Date());
// 			newDb = new models.analitika;
// 			newDb.thisMonth = String(date.getMonth()) + "-" + String(date.getFullYear());
// 			newDb.day =  String(date.getDate()) + "-" + String(date.getMonth()) + "-" + String(date.getFullYear());
// 			newDb.visits = 0;
// 			newDb.uniqVisits = 0;
// 			newDb.ip = [];
// 			newDb.save();
// 		}
// 		else {
// 			oldDb = data[0];
// 			day = oldDb.day; 
// 			visits = oldDb.visits;
// 			uniqVisits = oldDb.uniqVisits;
// 			models.analitikaMonth.find({}, function(err, data) {

// 			})
// 			oldDb.remove();
// 			date = (new Date());
// 			newDb = new models.analitika;
// 			newDb.thisMonth = String(date.getMonth()) + "-" + String(date.getFullYear());
// 			newDb.day =  String(date.getDate()) + "-" + String(date.getMonth()) + "-" + String(date.getFullYear());
// 			newDb.visits = 0;
// 			newDb.uniqVisits = 0;
// 			newDb.ip = [];
// 			newDb.save();
// 		}	
// 	})
// };
// function creatDbMonth() {
// 	models.analitikaMonth.find({}, function(err, data) {
// 		'use strict'
// 		// if (err)
// 		var 	newDb,
// 				date,
// 				db,
// 				thisMonth
// 				daysPrevMonth,
// 				daysLength,
// 				i,
// 				sumVisits = 0,
// 				sumUniqVisits = 0
// 				daysArr_JSON;
// 		thisMonth = String(date.getMonth()) + "-" + String(date.getFullYear());	
// 		if (data[0]) {
// 			db	= data[0];
// 			newDb = new models.analitikaMonth;
// 			newDb.month = thisMonth;
// 			daysPrevMonth = db.days;
// 			daysLength = daysPrevMonth.length;
// 			for (i = 0; i < daysLength; i++) {
// 				sumVisits += daysPrevMonth[i].visits
// 				sumUniqVisits += daysPrevMonth[i].uniqVisits
// 			}
// 			newDb.visits = sumVisits;
// 			newDb.uniqVisits = sumUniqVisits;
// 			daysArr_JSON = JSON.parse(daysPrevMonth);
// 			newDb.days = 
// 			newDb.save();	
// 		}
// 		else {
// 			date = (new Date());
// 			newDb = new models.analitikaMonth;
// 			newDb.month = thisMonth;
// 			newDb.visits = 0;
// 			newDb.uniqVisits = 0;
// 			newDb.days = [];
// 			newDb.save();
// 		}	
// 	})
// };
// function creatDbYear() {
// 	models.analitika.find({}, function(err, data) {
// 		'use strict'
// 		// if (err)
// 		var 	newDb,
// 				date;
// 		if (!data[0]) {
// 			date = (new Date());
// 			newDb = new models.analitika;
// 			newDb.thisMonth = String(date.getMonth()) + "-" + String(date.getFullYear());
// 			newDb.day =  String(date.getDate()) + "-" + String(date.getMonth()) + "-" + String(date.getFullYear());
// 			newDb.visits = 0;
// 			newDb.uniqVisits = 0;
// 			newDb.ip = [];
// 			newDb.save();
// 		}	
// 	})
// };

// var visits = function amountVisits(req) {
// 	
// };
// var createDb = function createDbVisits() {
// 	var db = creatDbDay();
// 	console.log(db)
// };







