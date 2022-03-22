const express = require('express');
const app = express();
const cors = require('cors');
const register = require('./routes/register');
const login = require('./routes/login');
const seminarDetails = require('./routes/seminarDetails');
const coordinator = require('./routes/coordinator');
const attender = require('./routes/attender');
const home = require('./routes/home');

app.use(cors());

app.use('/register', register);
app.use('/login', login);
app.use('/seminarDetails', seminarDetails);
app.use('/coordinator', coordinator);
app.use('/attender', attender);
app.use('/home', home);

app.listen(4000);