const bunyan = require('bunyan');
const uuid = require('uuid/v4');
var bsyslog = require('bunyan-syslog');

const logsHost = process.env.LOGS_HOST;
const logsPort = process.env.LOGS_PORT;

if(logsHost === undefined) throw Error('You must configure the logs host');
if(logsPort === undefined) throw Error('You must configure the logs port');

const log = bunyan.createLogger({
    name: 'myApp',
    streams: [
        { stream: process.stdout },
        {
            level: 'debug',
            type: 'raw',
            stream: bsyslog.createBunyanStream({
                type: 'udp',
                host: logsHost,
                port: parseInt(logsPort)
            })
        }
    ],
    serializers: {
        err: bunyan.stdSerializers.err,   
    }
});

const logger = (req, res, next) => {
    req.id = req.header('X-Request-Id') || uuid()
    req.log = log.child({ id: req.id })
    req.log.info({ body: req.body }, 'Request received')
    res.setHeader('X-Request-Id', req.id)
    next()
}

module.exports = {
    logger,
    log
}