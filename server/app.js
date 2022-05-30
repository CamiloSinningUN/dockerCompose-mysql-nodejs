const express = require("express");
const app = express();
const mysql = require("mysql");
const body_parser = require("body-parser");
const util = require("util");
const { read } = require("fs");
app.use(express.json());
app.use(require("morgan")("dev"));
app.use(body_parser.json());
const PORT = process.env.PORT || 3001;

const connection = mysql.createConnection({
  host: "db",
  user: "root",
  password: "123",
  database: "proyecto",
});

//this method try to connect to the database until it is successful
function connect(){
  connection.connect(function (err) {
    if (err) {
      //retry connection
      console.log("Error connecting to the database");
      console.log("Trying to reconnect...");
      setTimeout(connect, 5000);
    } else {
      console.log("Conexión a base de datos establecida");
    }
  });
}

connect();

const query = util.promisify(connection.query).bind(connection);

// this method returns ok if the connection is established and nok if it is not
app.get("/connection", (req, res) => {
  connection.ping((err) => {
    if (err) return res.send("nok");
    res.send("ok");
  });
});

// this method creates and user in the database
app.post("/adduser", (req, res) => {
  const { username, password, nrc } = req.body;
  //verify the user does not exist
  connection.query(
    "SELECT * FROM user WHERE username = ?",
    [username],
    (err, rows) => {
      if (err) return res.send("nok");
      if (rows.length > 0) {
        return res.send("nok");
      } else {
        connection.query(
          `INSERT INTO user (username, password, nrc) VALUES ('${username}', '${password}', ${nrc})`,
          (err, result) => {
            if (err) {
              res.send("nok");
            } else {
              res.send("ok");
            }
          }
        );
      }
    }
  );
});

// this method authenticates a user
app.post("/authenticate", (req, res) => {
  const { username, password, nrc } = req.body;

  connection.query(
    `SELECT id FROM user WHERE username = '${username}' AND password = '${password}' AND nrc = '${nrc}'`,
    (err, result) => {
      if (err) {
        res.send("nok");
      } else {
        res.send(result);
      }
    }
  );
});

// this method deletes all the users in the database
app.delete("/delete", (req, res) => {
  connection.query(`DELETE FROM user`, (err, result) => {
    if (err) {
      res.send("nok");
    } else {
      res.send("ok");
    }
  });
});

app.post("/addusers", async (req, res) => {
  const users = req.body;
  console.log(users);
  let object = { exist: false };

  for (const i of users){
    //verify the user does not exist
    try {
      const user = await query(
        `SELECT * FROM user WHERE username = '${i.username}'`
      );
      console.log(user.length, undefined>0);
      if (user.length > 0){
        object.exist = true;
      }
    } catch (error) {
      console.log('errorsito', error);
      return res.send("nok");
    }
  }

  if (!object.exist) {
    users.forEach(async (i) => {
      try {
        await query(
          `INSERT INTO user (username, password, nrc) VALUES ('${i.username}', '${i.password}', ${i.nrc});`
        );
      } catch (error) {
        console.error(error);
        console.log(i);
        res.send("nok");
        return;
      }
    });
    res.send("ok");
  }else{
    res.send("nok");
  }
});

app.use((_, res, next) => {
  res.status(404);
});

// connection.end(function(){
//     console.log('Conneción terminada');
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});