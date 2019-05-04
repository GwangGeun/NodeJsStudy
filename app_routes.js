/*
  Router 기본 원리
*/
const express = require('express');
const app = express();

/*

  app 이라는 객체를 p1 파일에 전달 할 수 있다.

  const p1 = require('./routes/p1');   // 1번째 방식
  const route = p1(app);
  app.use('p1',route);

*/
const p1 = require('./routes/p1')(app); // 2번째 방식
app.use('/p1',p1);

const p2 = require('./routes/p2');
app.use('/p2',p2);


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
