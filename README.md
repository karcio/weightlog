# Weight log v. 1.0

## Description

Weight logger - web application to measure your Weight

- track weight
- insert weight
- display graph //TODO
- display average weight

## Requirements

- mysql installed
- nodejs with modules: bootstrap, ejs, express, mysql
  - for install above modules run following command
  ```
  npm install
  ```

## Configuration steps

### Create database

```
CREATE DATABASE IF NOT EXISTS weightdb;
```

### Create table

```
DROP TABLE IF EXISTS weight_log;
CREATE TABLE IF NOT EXISTS weight_log
  (
     id     INT(11) NOT NULL auto_increment,
     date   DATE NOT NULL,
     weight DOUBLE NOT NULL,
     PRIMARY KEY (id)
  );
```

### Create views

```
DROP TABLE IF EXISTS view_weight;
CREATE view view_weight
AS
  SELECT date,
         weight
  FROM   weight_log
  ORDER  BY date DESC;
DROP TABLE IF EXISTS view_weight_avg;
CREATE view view_weight_avg
AS
  SELECT Avg(weight_log.weight) AS AVG
  FROM   weight_log;
```

# PG

```
sudo dnf install postgresql-server postgresql
sudo systemctl start postgresql

sudo su - postgres
psql -c "alter user postgres with password 'pa88w0rd'"
createuser dbuser
createdb weightdb -O dbuser
sudo -u postgres psql
psql=# alter user dbuser with encrypted password 'pa88w0rd';
psql=# grant all privileges on database weightdb to dbuser;

sudo vim /var/lib/pgsql/data/pg_hba.conf
# IPv4 local connections:
change
host    all             all             127.0.0.1/32            ident
to
host    all             all             127.0.0.1/32            md5

sudo systemctl restart postgresql.service

npm run create


```

# Docker

1. Clone repository

```
git clone -b develop https://github.com/karcio/weightlog.git
cd weightlog/
```

2. File `app.js` change postgres port to fe. "5434"

```
vim app.js
```

```
const port = 5000;
port: "5434"
```

3. Update ports in `Dockerfile`

```
cd static/assets/docker/
vim Dockerfile
```

```
EXPOSE 5000 9229 5434
```

4. Update ports in `docker-compose.yml`

```
cd static/assets/docker/
vim docker-compose.yml
```

```
app:
  ports:
    - "5000:5000"

 db:
  ports:
    - 5434:5434
```

5. Build application

```
docker-compose up --build
```
