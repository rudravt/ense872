const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require("../connection.js");
var mysql = require('mysql');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const con = connection.getMySQLConnection();
con.connect();

app.get('/allSeminarConducted', ({ query: { userID } }, res) => {
    const getSeminarQuery = `select seminarID, seminarTitle, abstract, speaker, venue, seminarStartingDate, seminarEndDate from seminars where UserID = ${mysql.escape(userID)};`;
    try {
        con.query(getSeminarQuery, (err, result) => {
            if (err) throw err;
            //console.log(result);
            res.send(result);
        });
    } catch (err) {
        console.log(err);
    }
});

app.get('/getQueries', ({ query: { seminarID } }, res) => {
    try {
        con.query(`select query, priority, frequancy from ??;`, [seminarID + 'query'], (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (err) {
        console.log(err);
    }
});

app.put('/updateSeminarDetails', (req, res) => {
    const seminarID = req.body.seminarID;
    const speaker = req.body.speaker;
    const venue = req.body.venue;
    const seminarStartingDate = new Date(req.body.seminarStartingDate);
    const seminarEndDate = new Date(req.body.seminarEndDate);

    const updateSeminarDetailsQuery = `update seminars set venue = ${mysql.escape(venue)} ,seminarStartingDate =${mysql.escape(seminarStartingDate)}, seminarEndDate = ${mysql.escape(seminarEndDate)}, speaker = ${mysql.escape(speaker)} where seminarID = ${mysql.escape(seminarID)};`;
    try {
        con.query(updateSeminarDetailsQuery, err => {
            if (err) throw err;
        });
        res.send(true);
    } catch (err) {
        console.log(err);
    }
});

app.delete('/deleteSeminar', ({ query: { seminarID } }, res) => {
    try {
        con.query(`drop table ??;`, [seminarID], err => {
            if (err) throw err;
        });
        con.query(`drop table ??;`, [seminarID + 'query'], err => {
            if (err) throw err;
        });
        con.query(`delete from seminars where seminarID = ${mysql.escape(seminarID)};`, err => {
            if (err) throw err;
        });
        res.send(true);
    } catch (err) {
        console.log(err);
    }
});

module.exports = app;