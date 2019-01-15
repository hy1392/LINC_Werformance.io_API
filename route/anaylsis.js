const router = require('express').Router()
const Analysis = require('../models/analysis')
const History = require('../models/history')
const shell = require('shelljs')
const fs = require("fs")
const puppeteer = require('puppeteer')
var ObjectId = require('mongodb').ObjectId;
const csv = require('csvtojson')

var ID = function () {
  return '_' + Math.random().toString(36).substr(2, 9);
};
// 해당 url에 대한 전체 분석 진행
router.post('/', (req, res) => {
  var now = new Date();
  var datetime = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();
  datetime += ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
  var title = req.body.url
  if (!(title.slice(0, 7) == "http://" || title.slice(0, 8) == "https://")) title = "http://"+title
  var dir = req.body.userId + ID()
  console.log(title)
  if (shell.exec("lighthouse " + title + ` --output-path=./results/${dir}.json --output json --output html --output csv --chrome-flags='--headless'`)) {
    console.log("success")
    Analysis.create({
        userId: req.body.userId,
        title: title,
        date: datetime,
        dir: dir
      })
      .then(function(data){
        (async () => {
          let static_dir = __dirname.substring(0, __dirname.length - 5)
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.goto(`http://localhost:3000/analysisDetail/${data._id}`, {
            waitUntil: 'networkidle2'
          });
          //printBackground기본 false
          await page.pdf({
            path: `${static_dir}/results/${dir}.report.pdf`,
            format: 'A4',
            printBackground: true
          });
          await browser.close();
          await console.log("made pdf file")
          await makeHsitory(data, title, req.body.userId, datetime, dir);
          return res.send("success")
        })();
      })
      .catch(err => res.send(err))
  } else {
    console.log("fail")
    return res.json("error")
  }
})

router.post('/getAnalysisList', (req, res) => {
  Analysis.find({
    userId: req.body.userId
  }).then(results => res.send(results))
  .catch(err => res.send(err))
})

router.post('/getAnalysis', (req, res) => {
  Analysis.find({
      _id: req.body._id
    }).then(function (result) {
      let dir = __dirname.substring(0, __dirname.length - 5)
      fs.readFile(`${dir}/results/${result[0].dir}.report.html`, (err, data) => {
        if (err) throw err;
        res.send(data);
      });

      
    })
    .catch(err => res.send(err))
})

router.get('/getAnalysis/:id', (req, res) => {
  Analysis.find({
      _id: req.params.id
    }).then(function (result) {
      let dir = __dirname.substring(0, __dirname.length - 5)
      res.render(`${result[0].dir}.report.html`);
    })
    .catch(err => res.send(err))
})

router.post('/deleteAnalysisList', (req, res) => {
  Analysis.deleteOne({
      _id: req.body._id
    }).then(History.deleteOne({dir:req.body._id}).then(res.send("success")))
    .catch(err => res.send(err))
})

router.post('/getHistory', (req, res) => {
  console.log(req.body)
  Analysis.findOne({
      _id: new ObjectId(req.body._id)
    }).then((result) => {
      console.log(result.userId)
      console.log(result.title)
      History.find({
        userId: result.userId,
        title: result.title
      }).sort({
        '_id': -1
      }).limit(10)
      .then((result) => res.send(result))
    })
    .catch(err => res.send(err))
})

router.post('/getDetail', (req, res) => {
  console.log(req.body)
  Analysis.findOne({
      _id: new ObjectId(req.body._id)
    }).then((result) => {
      let dir = __dirname.substring(0, __dirname.length - 5)
      console.log(`${dir}/results/${result.dir}.report.csv`)
      const csvFilePath = `${dir}/results/${result.dir}.report.csv`
      csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
          res.send(jsonObj)
        })
      const jsonArray = csv().fromFile(csvFilePath);
    })
    .catch(err => res.send(err))
})

router.post('/getFile', (req, res) => {
  let dir = __dirname.substring(0, __dirname.length-5)
  res.download(`${dir}/results/${req.body.dir}.report.${req.body.type}`)
})

router.get('/getFile/:file/:type', (req, res) => {
  let dir = __dirname.substring(0, __dirname.length - 5)
  res.download(`${dir}/results/${req.params.file}.report.${req.params.type}`)
})

function makeHsitory(data, title, id, date, dir){
  let static_dir = __dirname.substring(0, __dirname.length - 5)
  fs.readFile(`${static_dir}/results/${dir}.report.json`, 'utf8', (err, result) =>{
    if(err) console.log(err)
    const JSONResult = JSON.parse(result)
    History.create({
      userId: id,
      title: title,
      date: date,
      score: `${JSONResult.categories.performance.score}-${JSONResult.categories.pwa.score}-${JSONResult.categories.accessibility.score}-${JSONResult.categories['best-practices'].score}-${JSONResult.categories.seo.score}`,
      dir:data._id,
    }).catch(e => {})
  })
}

module.exports = router