const axios = require('axios');
const cheerio = require('cheerio');

const keys = require('../config/keys');
const errorHandler = require('../utils/errorHandler');

const getHTML = async (url) => {
	const {data} = await axios.get(url);
	return cheerio.load(data);
}

function convertInObject(string) {
	let [bookmaker, pool_allocation] = String(string).split('/');
	bookmaker = Number(bookmaker);
	pool_allocation = Number(pool_allocation);
	return {bookmaker, pool_allocation}
}

module.exports.getCurrentDraw = async function (req, res) {
	const resultArray = [];
	let indexEvent = 1;
	try {
		let $ = await getHTML(`${keys.marathonURI}sttot.aspx`);
		const currentDrawLink = $('.sttot-row').eq(0).find('td.tt-cell').eq(0).find('a').attr('href');
		$ = await getHTML(`${keys.marathonURI + currentDrawLink}`);
		const rows = $('.tt-draw').find('tr');
		rows.each((index, row) => {
			if ($(row).hasClass('tt-group')) {
				resultArray.push({
					group: $(row).find('td').text(),
					events: []
				});
			}
			if ($(row).hasClass('sttot-row')) {
				const event = $(row).find('a[target="helpevent"]').text();
				const [nameFirstTeam, nameSecondTeam] = event.split(' - ');
				const w1 = convertInObject($(row).find(`#n${indexEvent}w1`).find('label').text());
				const wX = convertInObject($(row).find(`#n${indexEvent}wX`).find('label').text());
				const w2 = convertInObject($(row).find(`#n${indexEvent}w2`).find('label').text());

				resultArray[resultArray.length - 1].events.push({
					event,
					nameFirstTeam,
					nameSecondTeam,
					w1,
					wX,
					w2
				});
				indexEvent++;
			}
		});
		res.status(200).json({
			resultArray
		});
	} catch (e) {
		errorHandler(res, e);
	}
}

// const parse = async () => {
// 	const getHTML = async (url) => {
// 		const {data} = await  axios.get(url);
// 		return cheerio.load(data);
// 	}
// 	let $ = await getHTML(`${keys.marathonURI}sttot.aspx`);
// 	const currentDrawLink = $('.sttot-row').eq(0).find('td.tt-cell').eq(0).find('a').attr('href');
//
// 	$ = await getHTML(`${keys.marathonURI + currentDrawLink}`);
//
// 	const rows = $('.tt-draw').find('tr');
//
// 	const resultArray = [];
// 	let indexEvent = 1;
// 	rows.each((index,row) => {
// 		if($(row).hasClass('tt-group')){
// 			resultArray.push({
// 				group:$(row).find('td').text(),
// 				events:[]
// 			});
// 		}
// 		if($(row).hasClass('sttot-row')){
// 			const event = $(row).find('a[target="helpevent"]').text();
// 			const w1 = convertInObject($(row).find(`#n${indexEvent}w1`).find('label').text());
// 			const wX = convertInObject($(row).find(`#n${indexEvent}wX`).find('label').text());
// 			const w2 = convertInObject($(row).find(`#n${indexEvent}w2`).find('label').text());
//
// 			resultArray[resultArray.length-1].events.push({
// 				event,
// 				w1,
// 				wX,
// 				w2
// 			});
// 			indexEvent++;
// 		}
// 	});
//
// 	console.log(JSON.stringify(resultArray));
// 	// const tableDrawRow = $('.sttot-row').find('a[target="helpevent"]');
// 	// const array = [];
// 	// tableDrawRow.each((index,nameEvent) =>{
// 	// 	obj = {name: $(nameEvent).text()}
// 	// 	array.push(obj);
// 	// 	console.log(index);
// 	// });
//
// 	// tableDrawRow.each((index, row) =>{
// 	// 	console.log($(row).text());
// 	// });
// 	// console.log(array);
//
//
//
// }



