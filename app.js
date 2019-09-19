var fs = require("fs");
//var https = require('https'); # https
var bodyParser = require("body-parser");
var mysql = require("mysql");
var express = require("express");
var app = express();
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sklejka",
  database: "WEIGHTDB"
});
// https
//const privateKey = fs.readFileSync('/etc/letsencrypt/live/domain/privkey.pem', 'utf8');
//const certificate = fs.readFileSync('/etc/letsencrypt/live/domain/cert.pem', 'utf8');
//const ca = fs.readFileSync('/etc/letsencrypt/live/domain/chain.pem', 'utf8');
//const credentials = {
//  key: privateKey,
//  cert: certificate,
//  ca: ca
//};
app.set("view engine", "ejs");
app.get("/", function(req, rep) {
  con.query("SELECT * FROM `VIEW_WEIGHT`", function(err, result, fields) {
    if (err) throw err;
    rep.render("index", {
      result: result
    });
    console.log(result);
  });
});
app.get("/avg", function(req, rep) {
  con.query("SELECT * FROM `VIEW_WEIGHT_AVG`", function(err, result, fields) {
    if (err) throw err;
    rep.render("avg", {
      result: result
    });
    console.log(result);
  });
});
app.get("/insert", function(req, res) {
  res.render("insert");
});
app.post("/insert", function(req, res) {
  currentdate = req.body.date;
  weight = req.body.weight;
  console.log("Connected!");
  var sql =
    "INSERT INTO WEIGHT_LOG (DATE, WEIGHT) VALUES ('" +
    currentdate +
    "', '" +
    weight +
    "')";
  con.query(sql, function(err, result) {
    if (err) throw err;
    console.log(sql);
    console.log("1 record inserted");
    res.redirect("/");
  });
});

app.listen(3000, function() {
  console.log("Server is running on port 3000");
});

//https
//const httpsServer = https.createServer(credentials, app);
//httpsServer.listen(9443, () => {
//  console.log('HTTPS Server running on port 9443');
//});
