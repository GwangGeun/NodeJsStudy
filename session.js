const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
// const md5 = require('md5');
// It is not recommended to use md5
// 사용법은 sha256 과 동일

// const sha256 = require('sha256');
// It is not recommended to use md5
// 사용법은 md5 와 동일

const bkfd2Password = require("pbkdf2-password");
const hasher = bkfd2Password();
// key derivation function 방식
// 참고 자료 : https://d2.naver.com/helloworld/318732

const app = express();

app.use(session({
  secret: 'fasdfafsdf@!qwe2', // session 을 내 마음대로 암호화 하는 부분
  resave: false, // session id 를 접속할 때마다 새로 받는다 ( false가 권장사항 )
  saveUninitialized: true // session id 는 실제로 사용하기 전까지 발급하지 않는다 ( true가 권장사항 )
}))
// 세션_API 공식 주소 : https://www.npmjs.com/package/express-session
app.use(bodyParser.urlencoded({
  extended: false
}));

app.get('/count', function(req, res) {
  // < Example >
  //
  // case ) req.session.count
  //
  //        위의 경우는 session 의 id 값을 count 로 부여한 경우 임
  //
  if (req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send("hi session : " + req.session.count);

});

app.get('/auth/logout',function(req,res){
  delete req.session.displayName;
  //session 값 삭제
  res.redirect('/welcome');
})

app.get('/welcome', function(req, res) {

  // console.dir(req);
  // console.dir(req.session);
  // console.log("session value : "+req.session.displayName);

  if (req.session.displayName) {
    res.send(`<h1>Hello, ${req.session.displayName} </h1>
      <a href="/auth/logout">Logout</a>
    `);
  }
  // session 값이 있다면 ( 로그인이 되어 있는 상태라면 )
  else {
    res.send(`<h1>Welcome</h1>
      <a href="/auth/login">Logout</a>
    `);
  }
  // session 값이 없다면 ( 로그인이 되어 있는 상태가 아니라면 )
  // res.send(req.session);

})


let user = {
  username: 'gwanggeun',
  // password: '1234',
  password : 'aI5j8qZECDa/GuPKgUEjQuGJaK4829TSFS04uS390UuqFIO9fej5qR/RbJcczyishX2hTQ/OtlB7HsXBNZ3dniDXQ6rdCTzXpDB6xfDj1IxH1lwzS0ftjuMiFRHtubrj6K+l58emuUuJWxhre5sX2BNYZyZMVFohKK4rGsyILYs=',
  // password가 '1234'인 값을 salt 값과 묶어서 해쉬 알고리즘을 돌린 결과값
  salt : 'H4+nFRT00GrjXSuB9wS1vueS4XY8dcuUoxV5FfpkAYEMmD7Z8SuOng3zBkYcWbKcf2ZH+C535fdEvSXzW8acEg==',
  displayName: 'GwangGeun'
}
// test 를 위해 임의로 사용자 하나 만듦

app.post('/auth/login', function(req, res) {

  let uname = req.body.username;
  let pwd = req.body.password;
  // 사용자에게 넘겨받은 "아아디와 비밀번호"

  /*
      pbkdf2 를 이용했을 때의 방식
     < 참고 자료 > https://www.npmjs.com/package/pbkdf2-password
  */
  if(uname === user.username){
    hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
        if(hash === user.password){
          req.session.displayName = user.displayName;
          res.redirect("/welcome");
        }
        else {
          res.send('Who are you? <a href="/auth/login">login</a>');
        }
    })
  }
  else {
    res.send('Who are you? <a href="/auth/login">login</a>');
  }

  /*
     < sha256 & md5 를 사용했을 때의 로직 >

     if (uname === user.username && sha256(pwd+user.salt) === user.password) {
       req.session.displayName = user.displayName;
       //session 값 지정
       res.redirect("/welcome");
     } else {
       res.send('Who are you? <a href="/auth/login">login</a>');
     }

  */

  // res.send(req.body.username);

})

app.get('/auth/login', function(req, res) {
  let output = `
  <h1>Login</h1>
  <form action="/auth/login" method="post">
    <p>
      <input type="text" name="username" placeholder="username">
    </p>
    <p>
      <input type="password" name="password" placeholder="password">
    </p>
    <p>
      <input type="submit">
    </p>
  </form>
  `;
  res.send(output);
})

app.get('/tmp', function(req, res) {
  res.send("result : " + req.session.count);
});

app.listen(3000, function() {
  console.log(" Connected 3000 port !!!");
});
