const express = require('express');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const users = require('./routes/users');
const config = require('./config/database');

//mongodb 접속 명령어
//Connnect to Database
mongoose.connect(config.database);

//on Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to Database '+config.database);
});

//on Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: '+err);
});


const app = express();

//port number
const port = process.env.PORT || 3000;


// 콘솔에 요청시간을 표시하는 미들웨어
// app.use(function (req, res, next){
//   console.log('Time: ', Date.now());
//   next();
// });

// CORS 미들웨어
app.use(cors());

// JSON 활용을 위한 미들웨어
app.use(express.json());

// URL 인코딩된 데이터의 활용을 위한 미들웨어
//  url(주소창)에 인코딩 된 데이터를 쓰는것이 가능해짐.
app.use(express.urlencoded({ extended: true }));

// Static Folder 기능을 제공하는 미들웨어
app.use(express.static(path.join(__dirname, "public")));

//Passport 미들웨어
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// 라우팅 설정을 위한 미들웨어 (마지막에 넣을 것!)
// 라우팅 설정이 JSON 보다 앞에 위치하고 있으면 안됨.
app.use('/users', users);

//위 static폴더로 덮어쓰기 해서 표시 안됨.('/')부분. (/eng)부분은 표시 되는데, 필요없으니 주석처리.
// app.get('/', (req, res) => {
//   res.send('<h1>서비스 준비중입니다...ㅎㅎㅎ</h1> <p>잠시만 기다려주세요.</p>');
// });
// app.get('/eng', (req, res) => {
//   res.send('<h1>Under construction...</h1> <p>lorem.</p>');
// });

//start server
app.listen(port, ()=>{
  console.log(`Server started on port ${port}!`);
});