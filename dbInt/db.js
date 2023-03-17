const { Client } = require('pg');

const client = new Client({
  user: 'guillermohasbun',
  database: 'products',
  password: process.env.PASSWORD
});

client.connect()
  .then(res => console.log('connected to db'))
  .catch(err => console.log('connection error', err));

module.exports.client = client;