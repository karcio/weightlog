--su - postgres
--psql -p 5432
\c weightdb
ALTER USER dbuser WITH SUPERUSER;
ALTER DATABASE weightdb OWNER TO dbuser;

CREATE TABLE IF NOT EXISTS weight_log(
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  weight NUMERIC(4,1) NOT NULL
);
INSERT INTO weight_log (date, weight) VALUES (current_date, 85.5);
