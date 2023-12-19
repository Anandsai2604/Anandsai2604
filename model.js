const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const regUser = require('./reg');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 4000;
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/HEMATOLOGY', {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

