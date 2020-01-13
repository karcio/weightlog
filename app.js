const path = require("path");
const express = require("express");
const favicon = require("express-favicon");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;
const pg = require("pg");
const pool = new pg.Pool({
  user: "dbuser",
  database: "weightdb",
  password: "pa88w0rd",
  port: "5433"
});

app.use(express.static(path.join(__dirname, "static")));
app.use(favicon(__dirname + "/static/assets/images/favicon.ico"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const itemsPerPage = 25;
const page_id = 1;

app.get(
  "/",
  getWeight,
  getAvgWeight,
  getMinWeight,
  getMaxWeight,
  getLastRecord,
  getAllRecordsCount,
  renderMainPage
);

function getWeight(req, res, next) {
  pool.connect((err, client, done) => {
    //console.log(err);
    const query =
      "SELECT * FROM weight_log order by date desc LIMIT  '" +
      itemsPerPage +
      "' OFFSET ('" +
      page_id +
      "' - 1) * '" +
      itemsPerPage +
      "'";
    client.query(query, (error, result) => {
      done();
      if (error) {
        res.status(400).json({ error });
      }
      if (result.rows < "1") {
        res.status(404).send({
          status: "Failed",
          message: "No weight information found"
        });
      } else {
        req.weight = result.rows;
        console.log(result.rows);

        return next();
      }
    });
  });
}

function getAllRecordsCount(req, res, next) {
  pool.connect((err, client, done) => {
    //console.log(err);
    const query = "SELECT count(*) FROM weight_log";
    client.query(query, (error, result) => {
      done();
      if (error) {
        res.status(400).json({ error });
      }
      if (result.rows < "1") {
        res.status(404).send({
          status: "Failed",
          message: "No weight information found"
        });
      } else {
        req.count = result.rows;
        console.log(result.rows);

        return next();
      }
    });
  });
}

function getAvgWeight(req, res, next) {
  pool.connect((err, client, done) => {
    const query = "select round(avg(weight)::numeric,1) as avg from weight_log";
    client.query(query, (error, result) => {
      done();
      if (error) {
        res.status(400).json({ error });
      }
      if (result.rows < "1") {
        res.status(404).send({
          status: "Failed",
          message: "No weight information found"
        });
      } else {
        req.avg = result.rows;
        console.log(result.rows);
        next();
      }
    });
  });
}

function getMinWeight(req, res, next) {
  pool.connect((err, client, done) => {
    const query = "SELECT MIN(weight)FROM weight_log";
    client.query(query, (error, result) => {
      done();
      if (error) {
        res.status(400).json({ error });
      }
      if (result.rows < "1") {
        res.status(404).send({
          status: "Failed",
          message: "No weight information found"
        });
      } else {
        req.min = result.rows;
        console.log(result.rows);
        next();
      }
    });
  });
}

function getMaxWeight(req, res, next) {
  pool.connect((err, client, done) => {
    const query = "SELECT MAX(weight)FROM weight_log";
    client.query(query, (error, result) => {
      done();
      if (error) {
        res.status(400).json({ error });
      }
      if (result.rows < "1") {
        res.status(404).send({
          status: "Failed",
          message: "No weight information found"
        });
      } else {
        req.max = result.rows;
        console.log(result.rows);
        next();
      }
    });
  });
}

function getLastRecord(req, res, next) {
  pool.connect((err, client, done) => {
    const query = "SELECT * FROM weight_log ORDER BY ID DESC LIMIT 1";
    client.query(query, (error, result) => {
      done();
      if (error) {
        res.status(400).json({ error });
      }
      if (result.rows < "1") {
        res.status(404).send({
          status: "Failed",
          message: "No weight information found"
        });
      } else {
        req.last = result.rows;
        console.log(result.rows);
        next();
      }
    });
  });
}

function renderMainPage(req, res) {
  res.render("index", {
    weight: req.weight,
    avg: req.avg,
    minWeight: req.min,
    maxWeight: req.max,
    count: req.count,
    lastRecord: req.last
  });
}

app.get("/insert", (req, res) => {
  res.render("insert");
});
app.post("/insert", (req, res) => {
  const data = {
    currentdate: req.body.date,
    weight: req.body.weight
  };

  pool.connect((err, client, done) => {
    const query =
      "INSERT INTO weight_log(date,weight) VALUES($1,$2) RETURNING *";
    const values = [data.currentdate, data.weight];

    client.query(query, values, (error, result) => {
      done();
      if (error) {
        res.status(400).json({ error });
      }
      res.redirect("/");
    });
  });
});

app.get("/avg", (req, res) => {
  pool.connect((err, client, done) => {
    const query =
      "select round(avg(weight)::numeric,2) as avg from weight_log;";
    client.query(query, (error, result) => {
      done();
      if (error) {
        res.status(400).json({ error });
      }
      if (result.rows < "1") {
        res.status(404).send({
          status: "Failed",
          message: "No weight information found"
        });
      } else {
        res.render("avg", {
          result: result.rows
        });
        console.log(result.rows);
      }
    });
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
