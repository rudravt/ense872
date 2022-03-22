const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require("../connection.js");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const con = connection.getMySQLConnection();
con.connect();

app.get('/getSeminars', (req, res) => {
    const getseminars = `select seminarID, seminarTitle, abstract, speaker, venue, seminarStartingDate, seminarEndDate from seminars;`;
    try {
        con.query(getseminars, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (err) {
        console.log(err);
    }
});

module.exports = app