const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const logger = require('./utils/logger')
const bp_emails = require('./queues/bp_emails')
// const bp_certificates = require('./queues/bp_certificates')

//CREATE AND INIT QUEUES
bp_emails.start()
// bp_certificates.start()

logger.info('Queues started successfully')