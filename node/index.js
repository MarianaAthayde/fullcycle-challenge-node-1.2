const express = require('express')
const app = express()
const port = 3000
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database:'nodedb'
};

const mysql = require('mysql')
const connection = mysql.createConnection(config)

let sql = `INSERT INTO people(name) values('Wesley')`
connection.query(sql);
sql = `INSERT INTO people(name) values('Mariana')`
connection.query(sql);
sql = `SELECT * FROM people`
let result;
connection.query(sql, function (err, res, fields) {
    if (err) throw err;
    result = res;
  });
connection.end();

app.get('/', (req,res) => {
    let resultHtml = `
    <table>
      <tr>
        <th>Nome</th>
      </tr>
    `;

    result?.forEach(element => {
      resultHtml += `
      <tr>
        <td>${element.name}</td>
      </tr>`;
    });

    resultHtml += `</table>`;

    res.send('<h1>Full Cycle</h1>' +  resultHtml)
})

app.listen(port, ()=> {
    console.log('Rodando na porta ' + port)
})