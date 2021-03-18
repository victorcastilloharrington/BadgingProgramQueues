const RSMQ = require('rsmq')
const rsmq = new RSMQ

const options = {
  to: 'victor@standfortrees.org',
  subject: 'test queue',
  template: 'test',
  templateData: {
    msg: "Hillo Dude"
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