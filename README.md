[![Build Status](https://travis-ci.org/karcio/weightlog.svg?branch=master)](https://travis-ci.org/karcio/weightlog)
# Weight log v. 1.1

## Description

Weight logger - web application to measure your Weight

-   track weight
-   insert weight
-   display graph //TODO
-   display average weight

## Requirements

-   postgresql
-   nodejs   

## Configuration steps

1.  Create database


        CREATE USER dbuser ENCRYPTED PASSWORD 'pa88w0rd' NOSUPERUSER NOCREATEDB NOCREATEROLE;
        CREATE DATABASE weightdb WITH OWNER dbuser;
        \\c weightdb;
        CREATE TABLE IF NOT EXISTS weight_log(id SERIAL PRIMARY KEY, date DATE NOT NULL DEFAULT CURRENT_DATE, weight NUMERIC(4,1) NOT NULL );
        GRANT ALL PRIVILEGES ON DATABASE weightdb TO dbuser;
        GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO dbuser;
        GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO dbuser;

2.  Clone repository


        git clone <https://github.com/karcio/weightlog.git>

3.  Install dependencies


        cd weightlog
        npm install

4.  Start application


        npm run start
