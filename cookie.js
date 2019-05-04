const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

app.get('/count', function(req,res){

  let count;

  if(req.cookies.count){
    count = parseInt(req.cookies.count);
    // 쿠키가 보내주는 값이 "숫자" 더라도 문자열로 인식되서 날아온다.
    // 따라서, 사칙연산을 활용하기 위해서는 "숫자"로 바꿔줘야 한다.
  }
  // javascript 에서는 "값이 없으면", false 로 인식한다.
  else {
    count = 0 ;
  }

  count = count+1;
  res.cookie('count',count); // 쿠키 : count (key) 값을 1 (value)이라고 지정.
  res.send('count :'+count); // 쿠키 값을 화면에 보여 줌. 

});

app.listen(3000,function(){
  console.log(" Connected 3000 port !!!");
});
