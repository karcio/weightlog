# Weight log v. 1.0

## Description
Weight logger - web application to measure your Weight

* track weight
* insert weight

## Requirements
* mysql installed
* nodejs with modules: bootstrap, ejs, express, mysql
  * for install above mudules run following command
  ```
  npm install
  ```
## Configuration steps
#### Create database
```sh
CREATE DATABASE IF NOT EXISTS 'DATABASE';
```
#### Create tables
###### WEIGHT_LOG
```sh
CREATE TABLE IF NOT EXISTS `WEIGHT_LOG` (
  `ID` int(11) NOT NULL,
  `DATE` date NOT NULL,
  `WEIGHT` double NOT NULL
);
```
#### Create view
###### VIEW_WEIGHT
```sh
DROP TABLE IF EXISTS `VIEW_WEIGHT`;

CREATE VIEW `VIEW_WEIGHT` AS select `WEIGHT_LOG`.`DATE` AS `DATE`,`WEIGHT_LOG`.`WEIGHT` AS `WEIGHT` from `WEIGHT_LOG` order by `WEIGHT_LOG`.`DATE`;
```
