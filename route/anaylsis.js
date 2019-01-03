const router = require('express').Router()
const Analysis = require('../models/analysis')
const History = require('../models/history')
const shell = require('shelljs')
const fs = require("fs")
const puppeteer = require('puppeteer')


var ID = function () {
  return '_' + Math.random().toString(36).substr(2, 9);
};
// 해당 url에 대한 전체 분석 진행
router.post('/', (req, res) => {
  var now = new Date();
  var datetime = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();
  datetime += ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
  var title = req.body.url
  var dir = req.body.userId + ID()
  console.log(req.body.url)
  if (shell.exec("lighthouse " + req.body.url + ` --output-path=./results/${dir}.json --output json --output html --output csv --chrome-flags='--headless'`)) {
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
      // fs.readFile(`${dir}/results/${result[0].dir}.report.json`, (err, data) => {
      //   if (err) throw err;
      //   let jsonData = JSON.parse(data);
      //   res.send(jsonData);
      // });
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
      // fs.readFile(`${dir}/results/${result[0].dir}.report.json`, (err, data) => {
      //   if (err) throw err;
      //   let jsonData = JSON.parse(data);
      //   res.send(jsonData);
      // });
      res.render(`${result[0].dir}.report.html`);


    })
    .catch(err => res.send(err))
})

router.post('/deleteAnalysisList', (req, res) => {
  Analysis.remove({
      _id: req.body._id
    }).then(results => res.send(results))
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