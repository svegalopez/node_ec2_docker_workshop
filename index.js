const express = require('express');
const Axios = require('axios').default;
const connect = require('./database/connect').connect;
const client = require('./database/connect').client;
const app = express();
const port = process.env.PORT;
const logger = require('./logger').logger;
const log = require('./logger').log;

const authUrl = 'http://7158b16c395c:3000/authorize' // should come from service discovery

async function main() {

    if (port === undefined) throw Error('Please include a PORT env variable');
    
    await connect();

    app.use(logger);

    app.use('/', async (req, res, next) => {

        const authResponse = await Axios.get(authUrl).catch(err => {
            log.error({ err }, 'Error requesting auth');
        });

        if(process.env.LOCAL === 'true') return next();
        
        if(authResponse.data) return next();
        else return res.json('Nothing Here');

    })

    app.use('/now', async (req, res) => {
        
        log.info({ now: Date.now() }, 'Requested NOW')

        const result = await client.query('SELECT NOW()');
        res.json(result);

    });
    
    app.listen(port, _ => console.log(`App listening in port ${port}`));
}

main()
    .then(_ => console.log(`Server started`))
    .catch(err => console.error(err));