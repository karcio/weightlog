const express = require("express");
const bodyParser = require("body-parser");
const { pool } = require("./services/db");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", getWeight, getAvgWeight, renderMainPage);

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

function getWeight(req, res, next) {
  pool.connect((err, client, done) => {
    const query = "SELECT * FROM weight_log order by date desc";
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

function getAvgWeight(req, res, next) {
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
        req.avg = result.rows;
        console.log(result.rows);
        next();
      }
    });
  });
}

function renderMainPage(req, res) {
  res.render("index", {
    weight: req.weight,
    avg: req.avg
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`We are live at 127.0.0.1:${port}`);
});
