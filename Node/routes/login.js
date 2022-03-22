const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require("../connection.js");
var mysql = require('mysql');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const con = connection.getMySQLConnection();
con.connect();

app.get('/seminars', (req, res) => {
    con.query(`select seminarTitle from seminars`, (err, rows) => {
        if (err) {
            return res.status(400).send({
                message: err
            });
        }
        else {
            res.send(rows);
        }
    })
})

app.get('/attenderLogin', ({ query: { seminarTitle, seminarID } }, res) => {
    const loginQuery = `select seminarTitle, seminarID from seminars where seminarTitle = ${mysql.escape(seminarTitle)} and seminarID = ${mysql.escape(seminarID)}`
    try {
        con.query(loginQuery, (err, row) => {
            if (err) {
                return res.status(400).send({
                    message: err
                });
            } else {
                if (row.length === 0) {
                    res.send([{ 'isLoggedIn': false }]);
                } else {
                    res.send([{ 'isLoggedIn': true }]);
                }
            }
        });
    }
    catch (err) {
        console.log(err);
    }
});

app.get('/conductorLogin', ({ query: { userID, password } }, res) => {
    const loginQuery = `select userID, password from user where userID = ${mysql.escape(userID)} and password = ${mysql.escape(password)}`
    try {
        con.query(loginQuery, (err, row) => {
            if (err) {
                return res.status(400).send({
                    message: err
                });
            } else {
                if (row.length === 0) {
                    res.send([{ 'isLoggedIn': false }]);
                } else {
                    res.send([{ 'isLoggedIn': true }]);
                }
            }
        });
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = app