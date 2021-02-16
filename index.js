require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const cors = require('cors');
const config = require('./config');
const mongoDb = require('./helpers/connection');
require('./authentication');

//mongoDB connection
mongoDb.connectDb();

const index_routes = require('./routes/index');
const user_routes = require('./routes/user');
const coin_routes = require('./routes/coin');
const customMdw = require('./middleware/custom');

const app = express();

//Cors 
var corsOptions = {
    origin: '*', // Reemplazar con dominio
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

//conectamos todos los middleware de terceros
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));

//conectamos todos los routers
app.use('/', index_routes);
app.use('/api/users', user_routes);
app.use('/api/coins', coin_routes);


//el último nuestro middleware para manejar errores
app.use(customMdw.errorHandler);
app.use(customMdw.notFoundHandler);

const port = config.PORT;
app.listen(port, () => {
    console.log(`API rest listening at http://localhost:${port}`);
});