const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require("../connection.js");
var nodemailer = require('nodemailer');
var mysql = require('mysql');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const con = connection.getMySQLConnection();
con.connect();

app.post('/userRegistration', ({ body: { userName, userID, password } }, res) => {
    const selectQuery = `select userID from user where userID = ${mysql.escape(userID)};`;
    const insertQuery = `insert into user(userName, userID, password) values (${mysql.escape(userName)}, ${mysql.escape(userID)}, ${mysql.escape(password)});`;
    try {
        con.query(selectQuery, (err, row) => {
            if (err) {
                return res.status(400).send({
                    message: err
                });
            } else {
                if (row.length === 0) {
                    con.query(insertQuery, err => {
                        if (err) {
                            return res.status(400).send({
                                message: err
                            });
                        } else {
                            res.send([{ 'isRegistered': true }]);
                        }
                    });
                } else {
                    res.send([{ 'isRegistered': false }]);
                }
            }
        });
    }
    catch (err) {
        console.log(err);
    }
});

app.post('/attenderRegistration', ({ body: { name, emailID, seminarID, seminarTitle } }, res) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'rcsseproject@gmail.com',
            pass: 'CSSE1234'
        }
    });

    var mailOptions = {
        from: 'rcsseproject@gmail.com',
        to: emailID,
        subject: 'Password for your Seminar',
        text: `Hi ${name},\r\nYour password for ${seminarTitle} is ${seminarID}.\r\n`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.send([{ 'isRegistered': false }]);
        } else {
            res.send([{ 'isRegistered': true }]);
        }
    });
});

module.exports = app