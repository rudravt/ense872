const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require("../connection.js");
const rake = require('node-rake');
const fs = require('fs');
const shortid = require('shortid')
var mysql = require('mysql');
var _ = require("underscore");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const con = connection.getMySQLConnection();
con.connect();

app.post('/insertDetails', (req, res) => {
    const seminarTitle = req.body.seminarTitle;
    const abstract = req.body.abstract;
    const speaker = req.body.speaker;
    const venue = req.body.venue;
    const seminarStartingDate = new Date(req.body.seminarStartingDate);
    const seminarEndDate = new Date(req.body.seminarEndDate);
    const userID = req.body.userID;
    let seminarID = shortid.generate();
    seminarID = seminarID.replace('-', '_');
    const insertSeminarQuery = `insert into seminars (seminarID, seminarTitle, abstract, speaker, venue, seminarStartingDate, seminarEndDate, userId) values (${mysql.escape(seminarID)}, ${mysql.escape(seminarTitle)}, ${mysql.escape(abstract)}, ${mysql.escape(speaker)}, ${mysql.escape(venue)}, ${mysql.escape(seminarStartingDate)}, ${mysql.escape(seminarEndDate)}, ${mysql.escape(userID)});`;
    let abstractKeywords = rake.generate(abstract);
    const creatRelaedWordTable = `create table ?? (word VARCHAR(100), primary key(word));`;
    const createQueryTable = `create table ?? (query VARCHAR(500), priority INT, frequancy INT);`;

    try {
        con.query(insertSeminarQuery, err => {
            if (err) throw err;
        });

        con.query(creatRelaedWordTable, [seminarID], err => {
            if (err) throw err;
        });

        con.query(createQueryTable, [seminarID + 'Query'], err => {
            if (err) throw err;
        });
        abstractKeywords.forEach(e => {
            const insertWordQuery = `insert into ?? (word) values (${mysql.escape(e.toLowerCase())});`;
            con.query(insertWordQuery, [seminarID], err => {
                if (err) throw err;
            });
        });
        fs.readFile('./corpus/corpus.json', (err, data) => {
            if (err) {
                throw err;
            }
            var json = JSON.parse(data);
            filterData = _.where(json, { title: seminarTitle })
            // let filterData = json.filter(val => val.title.toLowerCase() === seminarTitle.toLowerCase());
            if (filterData.length === 0) {
                webTitle = seminarTitle.replace(' ', '%20');
                var { spawn } = require('child_process');
                var python = spawn('python', ['./python/fetchRelatedWords.py', webTitle]);
                python.on('exit', (code) => {
                    console.log('done');
                });
            }
        });
        res.send(true);
    } catch (err) {
        console.log(err);
    }
});

module.exports = app;