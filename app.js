const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const ls = require('local-storage');
const mysql = require('mysql');

var conn  = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'node'
  });


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));

// Login get and Post Method -------------------------------------

app.get('/', (req, res) => {
    let user = ls('user');
    if(user){
        res.redirect('/dashboard')
    }else{
        res.render('index');
    }
})

app.post('/',(req,res)=>{
    let {email,password} = req.body;
    let sql = `SELECT * FROM user WHERE email = '${email}' AND password = '${password}'`;
    conn.query(sql, (err, result) => {
        if(err) throw err;
        if(result.length > 0){
            console.log(result[0].name);
            ls.set('user',result[0].name);
            res.redirect('/dashboard');
        }else{
            res.redirect('/');
        }
    })
})

// register get And Post-------------------------------------------
app.get('/signup', (req, res) => {
    let user = ls('user');
    if(user){
        res.redirect('/dashboard');
    }{
        res.render('signup');
    }
})
app.post('/signup', (req, res) => {
    let {name,email,password} = req.body;
    let sql = `INSERT INTO user (name,email,password) VALUES ('${name}','${email}','${password}')`;
    conn.query(sql, (err, result) => {
        if(err) throw err;
        res.redirect('/');
    })
})
//Dashboard get Method ---------------------------------------------
app.get('/dashboard', (req, res) => {
    let user = ls('user');
    if(user){
        res.render('dashboard',{data: user});
    }else{
        res.redirect('/');
    }
})

app.get('/logout', (req, res) => {
    ls.remove('user');
    res.redirect('/');
});

app.get('*', (req, res) => {
    res.redirect('/');
})

app.listen(3000, () => {
    console.log('server is running on port 3000');
});