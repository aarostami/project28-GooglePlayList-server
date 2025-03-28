/* tslint:disable no-var-requires */
// const express = require('express')
import express from 'express'
// const fs = require('fs')
/* tslint:disable no-var-requires */
// const cors = require('cors')
import cors from 'cors'
/* tslint:disable no-var-requires */
// const bodyParser = require('body-parser')
import bodyParser from 'body-parser'
import gplay from 'google-play-scraper'	//baraye server ok hast
// const gplay = require('google-play-scraper')
// const memoized = m()

const app = express()
// app.use(express.urlencoded({extended: true}))	// for parsing application/x-www-form-urlencoded 
// app.use(bodyParser.urlencoded({extended: true}))
// app.use(bodyParser.urlencoded())
// app.use(cors({origin: 'https://aarostami.github.io/project28-GooglePlayList/'}))
app.use(cors({ origin: '*' }))

app.get('/', function (req, res) {
	res.set('Access-Control-Allow-Origin', '*')
	res.header("Access-Control-Allow-Origin", "*")
	res.send('server is on')
})

app.get('/category', function (req, res) {
	res.set('Access-Control-Allow-Origin', '*')
	res.header("Access-Control-Allow-Origin", "*")
	// res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
	// return { category: gplay.category }
	res.send({ category: gplay.category })
	/* return (category.length) ? Object.keys(category).map((value) =>
		<Chip label={value} variant='outlined' />
	) : 'loading' */
})

let render = 0
app.post('/', bodyParser.json(), async function (req, res) {
	let newgetList = [];
	let cat = req.body.catName
	let counter = req.body.counter

	await gplay.list({
		// await memoized.list({
		category: (cat != undefined && cat != '') ? cat : gplay.category.GAME_ACTION,
		collection: gplay.collection.TOP_FREE,
		num: (counter != undefined) ? counter : 5,
		// num: 5,
		//throttle: 2		//chon khode button 'more' mizanim loading mishe va nemiitoonim chand bar poshte sareham bezanim, pas inja taasir nadare.
		fullDetail: true	//agar ino nazarim bayad gplay.app dovom dar loop for ro run konim
	}).then(async data => {
		// ba map ya forEach ya ... nemishe.
		console.log(data)
		for (let i = 0; i < data.length; i++) {		//inja bahse pichidegi zamani mohemme.
			data[i].installsNum = data[i].installs.replaceAll(',', '').replace('+', '');
			/* newgetList = await gplay.app({	//time ziyadi ke tool mikeshe be front react send kone bekhatere in gplay dovom hast.
				// newgetList = await memoized.app({
				appId: data[i].appId
			}).then(da =>
			// data.install = da.installs;
			// data.forEach((val) =>
			{
				console.log(da)
				const numi = da.installs.replaceAll(',', '').replace('+', '');
				data[i].installs = da.installs
				data[i].installsNum = numi
			}
				// newgetList = data;	//ino inja mizarim nemidoonam chera dar return undefined mishe.
				// return data
			) */
		}
		newgetList = data;	//data yek array [] hast, ke taghiir dade shode, vali chon array hast, newgetList.push(data) dorost nista.
	});

	render++;
	res.set('Access-Control-Allow-Origin', '*')
	res.header("Access-Control-Allow-Origin", "*")
	// return newgetList
	// setTimeout(() => res.send(newgetList), 500)
	res.send(newgetList)
})

app.listen(8000, () => { console.log('server run') })