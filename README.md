# Weight log v. 1.0

## Description
Weight logger - web application to measure your Weight

* track weight
* insert weight
* display graph //TODO
* display average weight

## Requirements
* mysql installed
* nodejs with modules: bootstrap, ejs, express, mysql
  * for install above modules run following command
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
