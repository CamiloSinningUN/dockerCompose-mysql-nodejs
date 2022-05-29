const express = require('express');
const app = express();
const mysql = require('mysql');
const body_parser = require('body-parser');
app.use(express.json());
app.use(body_parser.urlencoded({extended:true}));
const PORT = process.env.PORT || 8005;

const connection = mysql.createConnection({
    host     : 'db',
    user     : 'root',
    password : 'estructuras',
    database : 'proyecto'
});

//this method try to connect to the database until it is successful
connection.connect(function(err) {
    if (err) {
        //retry connection
        console.log("Error connecting to the database");
        setTimeout(connection.connect, 2000);
    }else{
        console.log('Conexión a base de datos establecida');
    }
});

// this method returns ok if the connection is established and nok if it is not
app.get("/connection", (req, res) => {     
    connection.ping((err) => {
        if(err) return res.send("nok");
        res.send("ok");
    })
});

// this method creates and user in the database
app.post('/addUser', (req, res) => {
    const {username, password, nrc} = req.body;
    connection.query(`INSERT INTO user (username, password, nrc) VALUES ('${username}', '${password}', '${nrc}')`, (err, result) => {
        if(err){
            res.send(err)
        }else {
            res.send('ok')
        }
    })
});

// this method authenticates a user
app.post('/authenticate', (req, res) => {
    const {username, password, nrc} = req.body;
    connection.query(`SELECT id FROM user WHERE username = '${username}' AND password = '${password}' AND nrc = '${nrc}'`, (err, result) => {
        if(err){
            res.send('nok')
        }else {
            res.send(result)
        }
    })
});

// this method deletes all the users in the database
app.delete('/delete', (req, res) => {
    connection.query(`DELETE FROM user`, (err, result) => {
        if(err){
            res.send('nok')
        }else {
            res.send('ok')
        }
    })
});

// charge users from a csv file
app.post('/chargeUsers', (req, res) => {
    const {file} = req.body;
    connection.query(`LOAD DATA LOCAL INFILE '${file}' INTO TABLE user FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 ROWS`, (err, result) => {
        if(err){
            res.send('nok')
        }else {
            res.send('ok')
        }
    })
});

app.use((_, res, next) => {
    res.status(404);
});

// connection.end(function(){
//     console.log('Conneción terminada');
// });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});

// app.post('/upload', (req, res) => {
//     const data = req.body.data;
//     var $query;
//     var username, password, nrc;
//     for (let i = 0;i<data.lenght;i++) {
//         username = data[i].username;
//         password = data[i].paaword;
//         nrc = data[i].nrc;
//         $query += 'INSERT INTO user (username, password,nrc) VALUES ('+username+','+password +','+nrc+');';
//     }
//     connection.query($query, function(err, rows, fields) {
//         if(err){
//             res.send('nok');
//             return;
//         }else {
//             res.send('ok');
//         }
        
//     });

// });


// app.post('/connection', (req, res) => {
//     const $query = 'SELECT FROM user';
//     connection.query($query, function(err, rows, fields) {
//         if(err){
//             res.send('nok');
//             return;
//         }    
//         res.send('ok');
//     });
// });

// app.post('/adduser', (req, res) => {
//     const username = req.body.username;
//     const password = req.body.password;
//     const nrc = req.body.nrc;
//     const $query = 'INSERT INTO user (username, password,nrc) VALUES ('+username+','+password +','+nrc+')';

//     connection.query($query, function(err, rows, fields) {
//         if(err){
//             res.send('nok');
//             return;
//         }    
//         res.send('ok');
//     });
// });

// app.post('/authenticate', (req, res) => {
//     const username = req.body.username;
//     const password = req.body.password;
//     const nrc = req.body.nrc;
//     const $query = 'SELECT id FROM user where username=' + username + 'and password=' + password +'and nrc='+ nrc;

//     connection.query($query, function(err, rows, fields) {
//         if(err){
//             res.send('nok');
//             return;
//         }    
//         res.send('ok');
//     });
// });

// app.delete('/delete', (_, res) => {
//     const $query = 'DELETE FROM user';

//     connection.query($query, function(err, rows, fields) {
//         if(err){
//             res.send('nok');
//             return;
//         }    
//         res.send('ok');
//     });
// });



// app.use((_, res, next) => {
//     res.status(404);
// });


// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`)
// })








