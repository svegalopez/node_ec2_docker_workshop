const { Client } = require('pg')
const client = new Client()

exports.client = client;

exports.connect =  function () {
    return client.connect()
}

exports.end =  function () {
    return client.end()
}

// Required env variables: 
// PGUSER=user
// PGHOST=host
// PGPASSWORD=password
// PGDATABASE=db
// PGPORT=5432