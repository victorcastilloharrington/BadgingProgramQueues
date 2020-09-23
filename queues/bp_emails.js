const RSMQ = require('rsmq')
const RSMQ_Worker = require('rsmq-worker')
const { parse } = require('flatted')

const email = require('../utils/email')
const logger = require('../utils/logger')

const rsmq = new RSMQ()
let worker = new RSMQ_Worker("bp_emails", {
  maxReceiveCount: 2
})

rsmq.createQueue({ qname: "bp_emails", maxsize: -1 }, function (err, resp) {
  if (err) {
    if (err.name !== 'queueExists')
      logger.error(err)

    return
  }

  if (resp === 1) {
    logger.info("bp_emails queue created")
  }
})

worker.on("message", function (msg, next, id) {
  // process EMAIL
  email(JSON.parse(msg))
    .then(res => {
      logger.info(res)
    })
    .catch(err => {
      logger.error(err)
    })
  next()
})

worker.on('exceeded', function (msg) {
  logger.error(JSON.stringify("[BP EMAILS EXCEEDED]", msg.id))
  return
})
worker.on('timeout', function (msg) {
  logger.error(JSON.stringify("[BP EMAILS TIMEOUT]", msg.id, msg.rc))
  return
})

module.exports = worker