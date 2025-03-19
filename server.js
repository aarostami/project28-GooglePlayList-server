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
app.use(cors())

app.get('/category', function (req, res) {
	// return { category: gplay.category }
	res.send({ category: gplay.category })
	/* return (category.length) ? Object.keys(category).map((value) =>
		<Chip label={value} variant='outlined' />
	) : 'loading' */
})

app.post('/', bodyParser.json(), async function (req, res) {
	let newgetList = [];
	let cat = req.body.catName
	let counter = req.body.counter

	await gplay.list({
		// await memoized.list({
		category: (cat != undefined && cat != '') ? cat : gplay.category.GAME_ACTION,
		collection: gplay.collection.TOP_FREE,
		num: (counter != undefined) ? counter : 5
	}).then(async data => {
		// ba map ya forEach ya ... nemishe.
		console.log(data)
		for (let i = 0; i < data.length; i++) {
			newgetList = await gplay.app({
				// newgetList = await memoized.app({
				appId: data[i].appId
			}).then(da =>
			// data.install = da.installs;
			// data.forEach((val) =>
			{
				const numi = da.installs.replaceAll(',', '').replace('+', '');
				data[i].installs = da.installs
				data[i].installsNum = numi
			}
				// newgetList = data;	//ino inja mizarim nemidoonam chera dar return undefined mishe.
				// return data
			)
		}
		newgetList = data;
	});

	// return newgetList
	res.send(newgetList)
})

/* app.post('/', bodyParser.json(), function (req, res) {
	console.log(req.body)
	res.end('heelo')
}) */

app.listen(8000, () => { console.log('server run') })