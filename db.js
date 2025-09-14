const mongoose = require('mongoose');
const mongourl = 'mongodb://localhost:27017/hotel'

mongoose.connect(mongourl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection;

db.on('connected', () =>{
  console.log('connected to mongoDb server')
});

db.on('error', () => {
  console.log("Mongodb connection error");
});

db.on('disconnected', () => {
  console.log('MongoDb disconnected');
});

module.exports = db;
