--su - postgres
--psql -p 5432
\c weightdb

CREATE TABLE IF NOT EXISTS weight_log(
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  weight NUMERIC(4,1) NOT NULL
);
\dt

INSERT INTO weight_log (date, weight) VALUES (current_date, 85.5);
SELECT * FROM weight_log;
