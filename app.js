const express = require('express')
const mongoose = require('mongoose')
const shell = require('shelljs')
const fs = require("fs")

const app = express()
const port = 3001

app.use(express.json())
app.use(express.static(__dirname + '/public'))
app.set('views', __dirname + '/results');
app.engine('html', require('ejs').renderFile);
//크로스도메인 허용
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

mongoose.Promise = global.Promise

//몽고 디비 주소
mongoose.connect('mongodb://localhost:27017/linc')
.then(() => console.log('mongodb connected'))
.catch(e => console.error(e))

//계정 정보 관련 라우터
app.use('/account', require('./route/account'))
//분석 정보 관련 라우터
app.use('/analysis', require('./route/anaylsis'))

app.listen(port, () => console.log(`Server listening on port ${port}`))
