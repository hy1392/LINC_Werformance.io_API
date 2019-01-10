const router = require('express').Router()
const Users = require('../models/users')
const jwt = require('jsonwebtoken')

// 현재 저장된 전체 유저 조회
router.get('/',(req, res) => {
  Users.findAll()
    .then(users => {
      res.send(users)
    })
    .catch(err => res.status(500).send(err))
})

//특정 아이디 정보 조회(id: 정보 조회할 아이디)
router.post('/getUser', (req, res) => {
  Users.findOne({
      id: req.body.id
    })
    .then(user => {
      let dataToSend = {
        id : user.id,
        name : user.name,
        birth : user.birth,
        gender : user.gender,
        email : user.email,
        tier : user.tier
      }
      res.send(dataToSend)
    })
    .catch(err => res.status(500).send(err))
})

//특정 아이디 유저 삭제(id: 삭제할 아이디)
router.post('/delete', (req, res) => {
  Users.deleteOne({id:req.body.id})
    .then(res.send(`record with id(${req.body.id}) deleted`))
    .catch(err => res.status(500).send(err))
})

//전체 사용자 삭제(파라미터 없음)
router.post('/deleteAll', (req, res) =>{
  Users.deleteMany({})
    .then(res.send("all record deleted"))
    .catch(err => res.status(500).send(err))
})

// 3. login(id: 사용자 아이디, pw: 사용자 비밀번호)
// 로그인 성공시 해당 사용자 정보 반환 / 로그인 실패시 not found 반환
router.post('/login', (req, res) => {
  Users.findOne({
      id: req.body.id, 
      pw: req.body.pw
    })
    .then(function(user){
      if(user){
        const secret = req.app.get('jwt-secret')
        var token = jwt.sign({
          id: user.id,
          tier: user.tier
        }, secret, {
          expiresIn: '1d'
        });
        user.token = token
        user.save()
        res.send({
          token: token,
          code: "success"
        })
        return
      }
      res.send({
        code: "not found"
      })
    })
    .catch(err => console.log(err))
})

// 4. register(id: 사용자 아이디, pw: 사용자 비밀번호, name: 사용자 이름, birth: 사용자 생년월일, gender: 사용자 성별, email: 사용자 이메일)
// 회원가입 성공시 해당 사용자 정보 반환 / 회원가입 실패시 회원가입 실패 사유 반환
router.post('/register', (req, res) => {
  console.log(req.body)
  Users.create(req.body)
    .then(user => res.send("success"))
    .catch(err => res.send(err))
})

// 5. findId(name: 사용자 이름, birth: 사용자 생년월일)
// 인증 성공시 해당 사용자 아이디 반환 / 인증 실패시 not found 반환
router.post('/findId', (req, res) => {
  Users.findOne({
      name: req.body.name,
      birth: req.body.birth
    })
    .then(user => res.send({id:user.id, code:"success"}))
    .catch(err => res.send({
      code: "not found"
    }))
})

// 5. findPw(id: 사용자 아이디, name: 사용자 이름, email: 사용자 이메일)
// 인증 성공시 해당 사용자 비밀번호 반환 / 인증 실패시 not found 반환
router.post('/findPw', (req, res) => {
  Users.findOne({
      id: req.body.id,
      name: req.body.name,
      email: req.body.email
    })
    .then(user => res.send({
      pw: user.pw,
      code: "success"
    }))
    .catch(err => res.send({
      code: "not found"
    }))
})

// 6. checkPw(id: 사용자 아이디, pw: 사용자 비밀번호)
// 인증 성공시 해당 사용자 정보 반환 / 인증 실패시 not found 반환
router.post('/checkPw', (req, res) => {
    Users.findOne({
        id: req.body.id,
        pw: req.body.pw
      })
      .then(user => res.send(user.id || "not found"))
      .catch(err => res.send("not found"))
})

// 7. updateUser
// 사용자 개인정보 수정
router.post('/update', (req, res) => {
  Users.findOne({
      id: req.body.id,
      pw: req.body.pw
    })
    .then(user => {
      const secret = req.app.get('jwt-secret')
      var token = jwt.sign({
        id: user.id,
        tier:user.tier
      }, secret, {
        expiresIn: '1d'
      });
      user.pw = req.body.pw
      user.name = req.body.name
      user.birth = req.body.birth
      user.email = req.body.email
      user.gender = req.body.gender
      user.tier = user.tier
      user.token = token
      user.save()
      res.send({
        token: token,
        code: "success"
      })
    })
    .catch(err => res.send("not found"))
})

// 7. updateUserTier
// 사용자 개인정보 수정
router.post('/updateTier', (req, res) => {
  Users.findOne({
      id: req.body.id,
    })
    .then(user => {
      const secret = req.app.get('jwt-secret')
      var token = jwt.sign({
        id: user.id,
        tier: "paid"
      }, secret, {
        expiresIn: '1d'
      });
      user.token = token
      user.tier = 'paid'
      user.save()
      res.send({
        token: token,
        code: "success"
      })
    })
    .catch(err => res.send("not found"))
})

//jwt 검증
router.post('/jwt', (req, res) => {
  const token = req.headers['x-access-token'] || req.query.token
  if (!token || token=="") {
    return res.json({
      success: false,
      message: 'not logged in'
    })
  }

  const p = new Promise(
    (resolve, reject) => {
      jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
        if (err) reject(err)
        resolve(decoded)
      })
    }
  )

  const onError = (error) => {
    res.json({
      success: false,
      message: error.message
    })
  }

  p.then((decoded) => {
    Users.findOne({
      id : decoded.id,
      token: token
    })
    .then((user) => {
      if (user) res.send(decoded)
      else res.send({success:false})
    })
    .catch(err => res.json({
      success: false,
      message: err.message
    }))
  }).catch(onError)
})

module.exports = router