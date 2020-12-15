const RSMQ = require('rsmq')
const rsmq = new RSMQ

const options = {
  to: 'victor.castillo@fulltimeforce.com',
  subject: 'test queue',
  template: 'test',
  templateData: {
    msg: "Hillo Nigga"
  }
}

const send = (options) => {
  rsmq.sendMessage({ qname: "bp_emails", message: JSON.stringify(options) }, function (err, resp) {
    if (err) {
      logger.error(err)
      return
    }

    console.log("bp_emails message sent ID:" + resp)
    return
  })

}

send(options)