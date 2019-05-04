/*
  < 사용법 >
  https://github.com/mysqljs/mysql

  < db connection >

*/

const mysql = require('mysql');
const conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'secret',
  database : 'my_db'
});

conn.connect();

/*

  < Select >

*/
const sql = 'SELECT * FROM topic'
conn.query(sql, function (err, rows, fields) {
  if (err){
    console.log(error);
  }
  else {
    for(let i=0; i<rows.length; i++){
      console.log(rows[i].id);
      }
    }
  });
conn.end();

/*

  < Insert > - 1

*/
const sql = 'INSERT INTO topic (name, title) VALUES ("GwangGeun","LOL")';
conn.query(sql, function (err, rows, fields) {
  if (err){
    console.log(error);
  }
  else {
    console.log(rows.insertId);
    // 여기서의 rows 에는 packet 정보가 들어가 있다.
    // 즉, rows 의 id 라 함은. 추가 된 "열" 의 고유 id 이다.
    // php 에서의 mysql last insert id 를 여기서는 위와 같이 구할 수 있는 셈이다.
    }
  });
conn.end();

/*

  < Insert > - 2

  (1) insert 에 추가되는 정보에 대해 sql 부분에는 물음표로 둔다.
  (2) 추가 되는 정보는 params 로 따로 빼둔다.
  (3) sql 쿼리를 mysql 에 질의하는 부분의 2번째 매개변수로 params 를 지정해 준다.
  (4) 보안상으로도 sql injection 을 막을 수 있으므로 1 번 방법보다 좋다
      ( 이 부분은 왜 sql injection이 방지 가능한건지 조사 필요 )

*/
const sql = 'INSERT INTO topic (name, title) VALUES (?,?)';
let params = ['GwangGeun','LOL'];
conn.query(sql, params, function (err, rows, fields) {
  if (err){
    console.log(error);
  }
  else {
    console.log(rows.insertId);
    // 여기서의 rows 에는 packet 정보가 들어가 있다.
    // 즉, rows 의 id 라 함은. 추가 된 "열" 의 고유 id 이다.
    // php 에서의 mysql last insert id 를 여기서는 위와 같이 구할 수 있는 셈이다.
    }
  });
conn.end();

/*

  < Update >

*/
const sql = 'UPDATE topic SET name=?, title=? WHERE id=?';
let params = ['Carrot','Blizzard',1];
conn.query(sql, params, function (err, rows, fields) {
  if (err){
    console.log(error);
  }
  else {
    console.log(rows);
    // 여기서의 rows 에는 packet 정보가 들어가 있다.
    }
  });
conn.end();


/*

  < Delete >

*/
const sql = 'DELETE FROM topic WHERE id=?';
let params = [1];
conn.query(sql, params, function (err, rows, fields) {
  if (err){
    console.log(error);
  }
  else {
    console.log(rows);
    // 여기서의 rows 에는 packet 정보가 들어가 있다.
    }
  });
conn.end();
