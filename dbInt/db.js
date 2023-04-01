const { Client } = require('pg');
require("dotenv").config();

const client = new Client({
  user: 'postgres',
  database: 'products',
  port: 5432,
  password: process.env.PASSWORD,
  host: '54.174.75.161',
});

client.connect()
  .then(res => console.log('connected to db'))
  .catch(err => console.log('connection error', err));

module.exports.client = client;