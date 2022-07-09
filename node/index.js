const express = require('express')
const app = express()
const port = 3000
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database:'nodedb'
};

app.get('/favicon.ico', (req, res) => res.status(204));
app.get('/', async (req,res) => {
    let result = await callDbs();
    
    if(result.length < 1)
      result = await callDbs("Full Cycle");

    let resultHtml = `
    <hr>
    <table>
      <tr>
        <th>Nome</th>
        <th>Ações</th>
      </tr>
    `;

    result?.forEach(element => {
      resultHtml += `
      <tr>
        <td>${element.name}</td>
        <td><a type="button" href="/delete/${element.id}">Excluir</a></td>
      </tr>`;
    });

    resultHtml += `</table>
    <hr>
    <p>Para inserir um nome use a rota: "/insert/{nome}"<br>Caso nenhum nome seja passado como parametro e nao houver nenhum nome cadastrado. O nome Full Cycle será inserido</p>`;

    res.send('<h1>Full Cycle Rocks!</h1>' +  resultHtml);
})

app.get('/insert/:name', async (req,res) => {
  await insertPerson(req.params.name);
  res.redirect('/');
})

app.get('/delete/:id', async (req,res) => {
    
  await deletePerson(req.params.id);
  res.redirect('back');
})

app.listen(port, ()=> {
    console.log('Rodando na porta ' + port)
})

async function callDbs(name) {
  console.log(`Call DBs - ${name}`);

  if(name)
    await insertPerson(name);

  return await selectPeople();
}

async function selectPeople(){
  const conn = await connect();
  const [rows] = await conn.query('SELECT * FROM people;');
  return rows;
}

async function insertPerson(person){
    const conn = await connect();
    const sql = 'INSERT INTO people(name) VALUES (?);';
    const values = [person];
    return await conn.query(sql, values);
}

async function deletePerson(id){
  const conn = await connect();
  const sql = 'DELETE FROM people WHERE id = ?;';
  const values = [id];
  return await conn.query(sql, values);
}

async function deletePersonAndRefresh(id, res, req){
  await deletePerson(id);
  res.redirect(req.get('/'));
}

async function connect(){
  if(global.connection && global.connection.state !== 'disconnected')
      return global.connection;

  const mysql = require("mysql2/promise");
  const connection = await mysql.createConnection(config);
  // const connection = await mysql.createConnection("mysql://root:luiztools@localhost:3306/crud");
  console.log("Conectou no MySQL!");
  global.connection = connection;
  return connection;
}