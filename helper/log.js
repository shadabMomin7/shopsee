let winston = require("winston");

let logger = winston.createLogger({
    transports : [ 
        new winston.transports.File({ filename : "error.log" , level : "error"}),
        new winston.transports.File({filename : "warn.log" , level : "warn"}),
        new winston.transports.File({filename :  "combined-error.log"}),
        new winston.transports.File({filename :  "debug.log" , level : "debug"}),
        new winston.transports.File({filename :  "info.log", level : "info"}),
        new winston.transports.File({filename :  "verbose.log", level : "verbose"}),
        new winston.transports.File({filename :  "silly.log", level : "silly"}),   
    ]
})

function log(level,message,data=undefined){
    logger.log({
        level,
        message,
        date : Date.now(),
        data
    })
}


module.exports = { logger:log};