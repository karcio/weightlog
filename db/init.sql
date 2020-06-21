su - postgres
psql -p 5432

\c weightdb
ALTER USER dbuser WITH SUPERUSER;
INSERT INTO 'weight_log' (date, weight) VALUES (current_date, 85.5);
SELECT * FROM weight_log;
