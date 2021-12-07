const express = require('express');
const router = express.Router();
// 밑에 두줄은 강의시간에 안했는데, 다음수업에서 적혀있는 내용.
const passport = require('passport');
const jwt = require('jsonwebtoken');

//선언함으로써 User 객체를 사용할 수 있음(models/user 파일 기능)
const User = require('../models/user');
const Card = require('../models/card');

const config = require('../config/database');

// 1. 사용자 등록 
router.post('/register', (req, res, next) => {
// API 이름을 '/register'라고 붙임.
  let newUser = new User({
    // new User 는 User라는 객체의 형식을 새로 만들겠다. 는것
    name: req.body.name, 
    email: req.body.email, 
    username: req.body.username, 
    password: req.body.password
  });

  User.getUserByUsername(newUser.username, (err, user) => {
    //username이 중복될때! 
    if (err) throw err;
    if (user) {
      return res.json({ success: false, msg: '동일 아이디가 존재합니다. 다른 username을 사용하세요'});
    } else {
      User.addUser(newUser, (err, user) => {
        if(err){ //error가 발생했을 경우의 값.
          res.json({ success: false, msg: '사용자 등록 실패' });
        } else {
          res.json({ success: true, msg: '사용자 등록 성공' });
        }
      });
    }
  });
}); 


// 2. 사용자 로그인 및 JWT 발급 (사용자 인증)
router.post('/authenticate', (req, res, next) => {
  // 사용자가 입력창에 입력한 username과 password를 변수에 저장?
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) =>{
    // 위에서 입력받은 사용자의 username과 password가 DB에 저장되어 있는지 검색
    if(err) throw err; //에러가 발생하면 이 뒷 과정들 건너뜀 (실행x
    if(!user) { //유저 정보가 없을때
      return res.json({success: false, msg: 'User not found'});
    }

    //err도 !user도 아니라는건 user 값이 있다는 것! 
    User.comparePassword(password, user.password, (err, isMatch) =>{
      if(err) throw err;
      if(isMatch){ //Yes, true가 나오면 아래 과정 실행, No, false가 나오면 else{} 과정 실행 
        let tokenUser = { //password 정보를 뺌.
          _id: user._id,
          name: user.name, 
          username: user.username, 
          email: user.email
        }
        
        const token = jwt.sign({data: tokenUser}, config.secret, {
          expiresIn: 604800 //1week정도의 유효기간
        });

        res.json({ //서버가 토큰에 응답함. (json 형태)
          success: true,
          token: token,
          userNoPW: tokenUser
        });
      } else {
        return res.json({success: false, msg: 'Wrong password _ 패스워드가 틀립니다.'});
      }
    });
  });
});


//3. Profile 페이지 요청, JWT 인증 이용
router.get("/profile", passport.authenticate("jwt", { session: false }), 
(req, res, next) => {
  res.json({
    userNoPW: {
      name: req.user.name,
      username: req.user.username,
      email: req.user.email,
    },
  });
});

//4. List
router.get("/list", passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    User.getAll((err, users) => {
      if (err) throw err;
      res.json(users);
    });
  }
);

//5. 명함 등록/수정 
router.post("/card", (req, res, next) => {
  let username = req.body.username; //username은 따로 뺌
  let update = {
    name: req.body.name,
    org: req.body.org,
    title: req.body.title,
    tel: req.body.tel,
    fax: req.body.fax,
    mobile: req.body.mobile,
    email: req.body.email,
    homepage: req.body.homepage,
    address: req.body.address,
    zip: req.body.zip,
  };

  Card.getCardByUsername(username, (err, card) => {
    if (err) throw err;
    if (card) { // 카드가 있으면 업데이트
      Card.UpdateCard(username, update, (err, card) => {
        return res.json({
          success: true, 
          msg: "명함정보 업데이트 성공",
        });
      });
    } else { //카드가 없으면 새로 등록
      update.username = req.body.username; 
      //update에는 username란을 따로 빼놨는데, 새로 등록할땐 username 칸 추가해주기.
      let newCard = new Card(update);
      Card.addCard(newCard, (err, card) => {
        if (err) throw err;
        if (card) {
          res.json({ success: true, msg: "명함 등록 성공" });
        } else {
          res.json({ success: false, msg: "명함 등록 실패" });
        }
      });
    }
  });
});

// 6. 내 명함정보 전송
router.post("/mycard", (req, res, next) => {
  Card.getCardByUsername(req.body.username, (err, card) => {
    if(err) throw err;
    if(card) {
      return res.json({
        success: true, 
        card: JSON.stringify(card),
      });
    } else {
      res.json({ success: false, msg: "명함정보가 없습니다." });
    }
  });
});


//다른 페이지도 JWT 인증을 통해 입장할수 있게 하려면 이렇게 ~ '/위치'를 만들어주고 비슷하게 res.json부분을 꾸며주면 될듯.
// //4. Product 페이지 요청, JWT 인증 이용
// router.get('/product', passport.au thenticate('jwt', { session: false }), (req, res, next) => {
//   res.json({
//     product: "Good product",
//     price: "10,000,000"
//   });
// });

module.exports = router;
