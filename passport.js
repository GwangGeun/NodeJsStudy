const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bkfd2Password = require("pbkdf2-password");
const hasher = bkfd2Password();
// key derivation function 방식
// 참고 자료 : https://d2.naver.com/helloworld/318732


/*

  < Passport 관련 참고하면 좋은 자료 >

  1. 조대협님의 블로그 : https://bcho.tistory.com/920?category=513811
  2. passport 공식 홈페이지 : http://www.passportjs.org/docs/authenticate/
  3. 생활코딩 : https://opentutorials.org/course/2136/12134

*/
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();

// 세션_API 공식 주소 : https://www.npmjs.com/package/express-session
app.use(session({
  secret: 'fasdfafsdf@!qwe2', // session 을 내 마음대로 암호화 하는 부분
  resave: false, // session id 를 접속할 때마다 새로 받는다 ( false가 권장사항 )
  saveUninitialized: true // session id 는 실제로 사용하기 전까지 발급하지 않는다 ( true가 권장사항 )
}))
app.use(passport.initialize());
app.use(passport.session()); // session setting 뒤쪽에 선언해줘야 한다.

app.use(bodyParser.urlencoded({
  extended: false
}));


// test 를 위해 임의로 사용자 하나 만듦
let user = {
  username: 'gwanggeun',
  // password: '1234',
  password : 'aI5j8qZECDa/GuPKgUEjQuGJaK4829TSFS04uS390UuqFIO9fej5qR/RbJcczyishX2hTQ/OtlB7HsXBNZ3dniDXQ6rdCTzXpDB6xfDj1IxH1lwzS0ftjuMiFRHtubrj6K+l58emuUuJWxhre5sX2BNYZyZMVFohKK4rGsyILYs=',
  // password가 '1234'인 값을 salt 값과 묶어서 해쉬 알고리즘을 돌린 결과값
  salt : 'H4+nFRT00GrjXSuB9wS1vueS4XY8dcuUoxV5FfpkAYEMmD7Z8SuOng3zBkYcWbKcf2ZH+C535fdEvSXzW8acEg==',
  displayName: 'GwangGeun'
}


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
  // delete req.session.displayName;
  // session 값 삭제

  // 기존에는 위와 같이 직접 세션 값을 삭제해줘야 했었으나 passport 를 사용하면서 아래 한줄로 대체가 가능
  req.logout(); // session 값을 삭제 해 준다.
  res.redirect('/welcome');

})

app.get('/welcome', function(req, res) {

  if (req.user && req.user.displayName) {
    res.send(`<h1>Hello, ${req.user.displayName} </h1>
      <a href="/auth/logout">Logout</a>
    `);
  }
  // passport.deserializeUser 의 done 에서 저장된 값을 참조
  else {
    res.send(`<h1>Welcome</h1>
      <a href="/auth/login">Logout</a>
    `);
  }
  // passport.deserializeUser 의 done 에서 저장된 값이 없을 때 호출

})


passport.serializeUser(function(user, done) {
  // console.log('serializeUser', user);
  done(null, user.username);
});
// session 값을 지정해주는 부분
// session 의 key 값 : user.username 으로 생각하면 된다.

passport.deserializeUser(function(id, done) {
  // console.log('deserializeUser', id);
  if(user.username === id){
    done(null, user); // 여기에 지정해주는 부분을 통해 추후 다른 콜백에서 req.user 로써 사용할 수 있다.
                      // 현재 페이지에서는 75 번째 라인을 참고 할 것
  }
  done('There is no user.'); // if 문에 걸리지 않을 경우, 이 부분이 실행되도록 한다.
                             // 이 부분이 없으면 deserializeUser 에서 무한루프 돌듯이 빠져나오지 못한다.
});
// session 값을 유지 해주는 부분
// 이전에 저장된 session 값이 있으면 id 에 이미 저장되어 있는 세션 값이 넘어온다.

passport.use(new LocalStrategy(
  function(username, password, done) {

    let uname = username;
    let pwd = password;
    // 사용자에게 넘겨받은 "아아디와 비밀번호"

    if(uname === user.username){
      hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
          if(hash === user.password){
            done(null,user);
          }
          else {
            done(null,false);
          }
      })
    }
    else {
      done(null,false);
    }
  }
));




app.post('/auth/login',
  passport.authenticate('local',
      {
        successRedirect: '/welcome',
        failureRedirect: '/auth/login',
        failureFlash: false
      }
    )
)


/*

  FaceBook 로그인을 기능을 구현하려면 https 가 적용되어 있어야 한다 (필수)

  1. 페이스북 개발자 공식 홈페이지 : https://developers.facebook.com/
  2. passport facebook 홈페이지 : http://www.passportjs.org/docs/facebook/

// const FacebookStrategy = require('passport-facebook').Strategy;
//
// passport.use(new FacebookStrategy({
//     clientID: '*************',
//     clientSecret: '**************',
//     callbackURL: "/auth/facebook/callback",
//     profileFields:['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone',
//    'updated_time', 'verified', 'displayName']   --> 기본 정보이외에 다른 정보들을 가져오고 싶은 경우 명시해줘야 한다. ( 173 번 line 참고 )
//   },
//   function(accessToken, refreshToken, profile, done) {
//       if (err) { return done(err); }
//       done(null, user);
//   }
// ));
// app.get('/auth/facebook',
//   passport.authenticate(
//     'facebook',
//      {scope:'email'} // 기본 정보 이외에 더 가져오고 싶은 정보
//   )                  // https://developers.facebook.com/docs/facebook-login/permissions/ 참고
// );
//
// app.get('/auth/facebook/callback',
//   passport.authenticate(
//     'facebook',
//     {
//       successRedirect: '/welcome',
//       failureRedirect: '/auth/login'
//     }
//   )
// );


*/

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
  <a href="/auth/facebook">facebook</a>
  `;
  res.send(output);
})

app.get('/tmp', function(req, res) {
  res.send("result : " + req.session.count);
});

app.listen(3000, function() {
  console.log(" Connected 3000 port !!!");
});
