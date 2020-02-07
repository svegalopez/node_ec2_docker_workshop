const express = require('express');
const connect = require('./database/connect').connect;
const client = require('./database/connect').client;
const app = express();
const port = process.env.PORT;

async function main() {

    if (port === undefined) throw Error('Please include a PORT env variable');
    
    await connect();

    app.use('/now', async (req, res) => {
        
        const result = await client.query('SELECT NOW()')
        res.json(result)
    });
    
    app.listen(port, _ => console.log(`App listening in port ${port}`));
}

main()
    .then(_ => console.log(`Server started`))
    .catch(err => console.error(err));