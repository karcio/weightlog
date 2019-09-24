const pg = require("pg");

const config = {
  user: "dbuser", //this is the db user credential
  database: "weightdb",
  password: "pa88w0rd",
  port: 5432,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000
};

const pool = new pg.Pool(config);

pool.on("connect", () => {
  console.log("connected to the Database");
});

const createTables = () => {
  const weightTable = `CREATE TABLE IF NOT EXISTS
    weight_log(
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        weight NUMERIC(4,1) NOT NULL
        )`;
  pool
    .query(weightTable)
    .then(res => {
      console.log(res);
      pool.end();
    })
    .catch(err => {
      console.log(err);
      pool.end();
    });
};

pool.on("remove", () => {
  console.log("client removed");
  process.exit(0);
});

//export pool and createTables to be accessible  from an where within the application
module.exports = {
  createTables,
  pool
};

require("make-runnable");
