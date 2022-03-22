const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require("../connection.js");
const rake = require('node-rake');
const fs = require('fs');
const mysql = require('mysql')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const con = connection.getMySQLConnection();
con.connect();

app.post('/query', ({ body: { query, seminarTitle, ID } }, res) => {

    // Check whether question is already in list
    const getQueries = `select query from ??;`;
    try {
        con.query(getQueries, [ID + 'query'], (err, result) => {
            if (err) throw err;
            const queKeywords = rake.generate(query);
            console.log(queKeywords)
            if (queKeywords.length === 0) {
                res.send(false);
            }
            else {
                if (result.length > 0) {
                    response = setQuery(query, result, ID, seminarTitle);
                }
                else {
                    setPriority(query, ID, seminarTitle)
                }
                res.send(true);
            }
        });
    }
    catch (err) {
        console.log(err);
    }
});

function setQuery(query, result, ID, seminarTitle) {
    if (result.length > 0) {
        result = result.map(el => el.query);
        var { spawn } = require('child_process');
        var python = spawn('python', ['./python/compareQueries.py', query]);
        python.stdin.write(JSON.stringify(result));
        python.stdin.end();
        python.stdout.on('data', function (data) {
            const queryResult = data.toString().split(/\r\n/);
            console.log(queryResult);
            if (queryResult[1] === 'matched') {
                const increaseFrequancy = `update ?? set frequancy = (frequancy+1) where query = ${mysql.escape(queryResult[0])};`;
                con.query(increaseFrequancy, [ID + 'query'], err => {
                    if (err) throw err;
                });
            }
            else {
                setPriority(query, ID, seminarTitle);
            }
        });
    }
}

function setPriority(query, ID, seminarTitle) {
    let mostRelavantWords = [], priority;
    const queKeywords = rake.generate(query);
    if (queKeywords.length === 0) {
        return false
    }
    else {
        const getMostRelavantWords = `select word from ??;`;
        con.query(getMostRelavantWords, [ID], (err, result) => {
            if (err) throw err;
            mostRelavantWords = result.map(el => el.word);
            const wordInFirstPriority = queKeywords.filter(el => mostRelavantWords.includes(el.toLowerCase()));
            if (wordInFirstPriority.length > 0) {
                priority = 1;
                const addNewQuery = `insert into ?? values (${mysql.escape(query)}, ${mysql.escape(priority)}, 1);`;
                con.query(addNewQuery, [ID + 'query'], err => {
                    if (err) throw err;
                });
            }
            else {
                fs.readFile('./corpus/corpus.json', (err, data) => {
                    let result = JSON.parse(data);
                    result = result.filter(el => el.title === seminarTitle);
                    words = result[0].words;
                    const wordInSecondPriority = queKeywords.filter(el => words.includes(el.toLowerCase()));
                    if (wordInSecondPriority.length > 0) {
                        priority = 2;
                    } else {
                        priority = 3;
                    }
                    const addNewQuery = `insert into ?? values (${mysql.escape(query)}, ${mysql.escape(priority)}, 1);`;
                    con.query(addNewQuery, [ID + 'query'], err => {
                        if (err) throw err;
                    });
                });
            }
        });
    }

}

module.exports = app;