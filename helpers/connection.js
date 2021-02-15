const mongoose = require('mongoose');
const config = require('../config');

const db_path = `mongodb://${config.MONGODB_HOST}:${config.MONGODB_DATABASE_PORT}/${config.MONGODB_DATABASE}`;
//const db_path = mongodb+srv://<username>:<password>@cluster0.ncdk5.mongodb.net/<dbname>?retryWrites=true&w=majority

const db_config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
};

async function connectDb() {
  try {
    const connection = await mongoose.connect(db_path, db_config);
    console.log('MongoDB Succesful connection');
  } catch (error) {
    console.log('MongoDB Error connection', error);
  }
}
exports.connectDb = connectDb;