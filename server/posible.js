import express from "express";
const app = express();
const mysql = require('mysql');
const body_parser = require('body-parser');
app.use(express.json());
app.use(body_parser.urlencoded({extended:true}));
const PORT = 80

const connection = mysql.createConnection({
    host     : 'data_base',
    user     : 'root',
    password : 'estructuras',
    database : 'proyecto'
});

connection.connect(function(err) {
    // en caso de error
    if(err){
        console.log(err.code);
        console.log(err.fatal);
        console.log('conexión a base de datos establecida')
    }else {
        console.log('No fué posible conectarse a la base de datos')
    }
});

app.post('/connection', (req, res) => {
    const $query = 'SELECT FROM user';
    connection.query($query, function(err, rows, fields) {
        if(err){
            res.send('nok');
            return;
        }    
        res.send('ok');
    });
});

app.post('/adduser', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const nrc = req.body.nrc;
    const $query = 'INSERT INTO user (username, password,nrc) VALUES ('+username+','+password +','+nrc+')';

    connection.query($query, function(err, rows, fields) {
        if(err){
            res.send('nok');
            return;
        }    
        res.send('ok');
    });
});

app.post('/authenticate', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const nrc = req.body.nrc;
    const $query = 'SELECT id FROM user where username=' + username + 'and password=' + password +'and nrc='+ nrc;

    connection.query($query, function(err, rows, fields) {
        if(err){
            res.send('nok');
            return;
        }    
        res.send('ok');
    });
});

app.delete('/delete', (_, res) => {
    const $query = 'DELETE FROM user';

    connection.query($query, function(err, rows, fields) {
        if(err){
            res.send('nok');
            return;
        }    
        res.send('ok');
    });
});

app.post('/upload', (req, res) => {
    const data = req.body.data;
    var $query;
    var username, password, nrc;
    for (let i = 0;i<data.lenght;i++) {
        username = data[i].username;
        password = data[i].paaword;
        nrc = data[i].nrc;
        $query += 'INSERT INTO user (username, password,nrc) VALUES ('+username+','+password +','+nrc+');';
    }
    connection.query($query, function(err, rows, fields) {
        if(err){
            res.send('nok');
            return;
        }else {
            res.send('ok');
        }
        
    });

});

app.use((_, res, next) => {
    res.status(404);
});



connection.end(function(){
    // La conexión se ha cerrado
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})





