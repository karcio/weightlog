require('dotenv').config();
const path = require("path");
const express = require("express");
const favicon = require("express-favicon");
const bodyParser = require("body-parser");
const app = express();
const pg = require("pg");
const app_port = process.env.APP_PORT;

const pool = new pg.Pool({
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT
});

app.use(express.static(path.join(__dirname, "static")));
app.use(favicon(__dirname + "/static/assets/images/favicon.ico"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

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
    if (err) {
      res.send('no database connection ...');
      console.log(err);
    }
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
        res.status(400).json({
          error
        });
      }
      if (result.rowCount > 0) {
        req.weight = result.rows;
        console.log(result.rows);
      } else {
        res.send('no data!');
      }
      return next();
    });
  });
}

function getAllRecordsCount(req, res, next) {
  pool.connect((err, client, done) => {
    if (err) {
      res.send('no database connection ...');
      console.log(err);
    }
    const query = "SELECT count(*) FROM weight_log";
    client.query(query, (error, result) => {
      done();
      if (error) {
        res.status(400).json({
          error
        });
      }
      if (result.rowCount > 0) {
        req.count = result.rows;
        console.log(result.rows);
      } else {
        res.send('no data!');
      }
      return next();
    });
  });
}

function getAvgWeight(req, res, next) {
  pool.connect((err, client, done) => {
    if (err) {
      res.send('no database connection ...');
      console.log(err);
    }
    const query = "select round(avg(weight)::numeric,1) as avg from weight_log";
    client.query(query, (error, result) => {
      done();
      if (error) {
        res.status(400).json({
          error
        });
      }
      if (result.rowCount > 0) {
        req.avg = result.rows;
        console.log(result.rows);
      } else {
        res.send('no data!');
      }
      next();
    });
  });
}

function getMinWeight(req, res, next) {
  pool.connect((err, client, done) => {
    if (err) {
      res.send('no database connection ...');
      console.log(err);
    }
    const query = "SELECT MIN(weight)FROM weight_log";
    client.query(query, (error, result) => {
      done();
      if (error) {
        res.status(400).json({
          error
        });
      }
      if (result.rowCount > 0) {
        req.min = result.rows;
        console.log(result.rows);
      } else {
        res.send('no data!');
      }
      next();
    });
  });
}

function getMaxWeight(req, res, next) {
  pool.connect((err, client, done) => {
    if (err) {
      res.send('no database connection ...');
      console.log(err);
    }
    const query = "SELECT MAX(weight)FROM weight_log";
    client.query(query, (error, result) => {
      done();
      if (error) {
        res.status(400).json({
          error
        });
      }
      if (result.rowCount > 0) {
        req.max = result.rows;
        console.log(result.rows);
      } else {
        res.send('no data!');
      }
      next();
    });
  });
}

function getLastRecord(req, res, next) {
  pool.connect((err, client, done) => {
    if (err) {
      res.send('no database connection ...');
      console.log(err);
    }
    const query = "SELECT * FROM weight_log ORDER BY ID DESC LIMIT 1";
    client.query(query, (error, result) => {
      done();
      if (error) {
        res.status(400).json({
          error
        });
      }
      if (result.rowCount > 0) {
        req.last = result.rows;
        console.log(result.rows);
      } else {
        res.send('no data!');
      }
      next();
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
    if (err) {
      res.send('no database connection ...');
      console.log(err);
    }
    const query =
      "INSERT INTO weight_log(date,weight) VALUES($1,$2) RETURNING *";
    const values = [data.currentdate, data.weight];

    client.query(query, values, (error, result) => {
      done();
      if (error) {
        res.status(400).json({
          error
        });
      }
      res.redirect("/");
    });
  });
});

app.get("/avg", (req, res) => {
  pool.connect((err, client, done) => {
    if (err) {
      res.send('no database connection ...');
      console.log(err);
    }
    const query =
      "select round(avg(weight)::numeric,2) as avg from weight_log;";
    client.query(query, (error, result) => {
      done();
      if (error) {
        res.status(400).json({
          error
        });
      }
      if (result.rowCount > 0) {
        res.render("avg", {
          result: result.rows
        });
      } else {
        res.send('no data!');
      }
    });
  });
});

app.get("/all", (req, res) => {
  pool.connect((err, client, done) => {
    if (err) {
      res.send('no database connection ...');
      console.log(err);
    }
    const query =
      "SELECT * FROM weight_log ORDER BY DATE DESC";
    client.query(query, (error, result) => {
      done();
      if (error) {
        res.status(400).json({
          error
        });
      }
      if (result.rowCount > 0) {
        res.render("all", {
          result: result.rows,
        });
      } else {
        res.send('no data!');
      }
    });
  });
});

app.listen(app_port, () => console.log(`... Application running ...`));
