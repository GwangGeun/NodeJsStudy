const express = require('express');
const bodyParser = require('body-parser');
// express 에서는 기본적으로 post 방식을 지원하지 않음. 따라서 이를 사용하기 위해서 body-parser 가 필요.
const multer = require('multer');
// 위와 마찬가지 이유. multer 는 파일 업로드를 위해 필요.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
const upload = multer({ storage: storage });
// < multer 사용법 >
// 1. 파일이 저장될 위치 지정
// 2. 파일명 등 기타사항 지정

const app = express();
app.locals.pretty = true;
// "개발자 보기" 에서 html 코드를 보기 좋게 해주는 부분
// 이 부분이 없으면, "개발자 보기" 에서 html 코드들이 한줄로 보임

app.set('view engine', 'jade');
// 사용할 view engine을 express에게 알려주는 코드
// express 프레임워크와 jade 엔진을 연결
app.set('views', './views');
// 템플릿이 있는 디렉토리를 express에게 알려주는 코드
// 생략은 가능하다. 단, 생략했을 경우 express 는 기본적으로 ./views 에 views 와 관련된 파일들이 있다고 생각한다.

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', function (req, res) {
  res.send("hello");
});

app.get('/test/:id/:mode', function (req, res) {
  res.send(req.params.id+'/'+req.params.mode);
});
// < semantic url >
// https://opentutorials.org/course/2136/11945 참고

app.get('/template', function(req, res){
  res.render('temp', {time:Date(), title:'Jade'});
});

app.get('/form', function(req, res){
  res.render('form');
});

app.get('/upload', function(req, res){
  res.render('upload');
});
// get 방식으로 upload 요청이 들어온 경우
// views 폴더의 하위에 있는 "upload.jade" 로 이동

app.post('/upload', upload.single('userfile'),function(req, res){
  res.send("success");
});
//  post 방식으로 upload 요청이 들어온 경우 ( "upload.jade" 에서 파일보내기 버튼을 눌렀을 경우에 호출 됨  )
//  "multer module "을 사용

app.post('/form_receiver', function(req,res){
  let title = req.body.title;
  let description = req.body.description;
  res.send(title+','+description);
});

app.get('/topic',function(req, res){

  const topics = [
     'Javascript is....',
     'Nodejs is...',
     'Express is...'
   ];
   const output = `
   <a href="/topic?id=0">JavaScript</a><br>
   <a href="/topic?id=1">Nodejs</a><br>
   <a href="/topic?id=2">Express</a><br><br>
   ${topics[req.query.id]}
   `;
   res.send(output);

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
