const log4js = require('log4js');
log4js.configure('./logging/log4js-config.json');

const logger = log4js.getLogger("app")
//logger.level = "debug";
logger.level = "warn";

module.exports = { logger, log4js };
// Import where needed
// const { appLogger, log4js } = require('./logger');