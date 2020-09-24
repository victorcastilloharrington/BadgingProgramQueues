const pdf = require('./pdf')
const RSMQ = require('rsmq')
const logger = require('./logger')
const rsmq = new RSMQ()

const certificate = async ({ name, email, retirements }) => {
  // on queue: send email with generated certs
  if (retirements.length > 0) {
    const certs = []
    const serials = []

    for (const retirement of retirements) {
      if (!retirement.serial.startsWith('P-'))
        serials.push(`https://${process.env.MARKIT_URL}.markit.com/br-reg/public/index.jsp?entity=apiRetirement&name=${retirement.serial}`)
      // const date = .toDateString()
      const date = new Date(retirement.createdAt).toDateString()
      const [, month, day, year] = date.split(' ')
      const formattedDate = `${day}/${month}/${year}`

      const cert = await pdf.certificate(
        name,
        retirement.serial,
        retirement.tonnes,
        formattedDate,
        `https://widgets.sfo2.digitaloceanspaces.com/assets/${retirement.prj_code}/cert.jpg`,
        false)

      certs.push(cert)
    }

    certificateEmail(name, email, certs, serials)
  }
}

const certificateEmail = async (name, email, certs, serials) => {

  const options = {
    to: email,
    subject: 'Carbon Credit Retirement',
    template: 'markit',
    templateData: {
      name: name
    }
  }

  if (serials.length > 0)
    options.templateData.serials = serials

  if (certs) {
    options.attachments = []
    certs.forEach((att, i) =>
      options.attachments.push({
        filename: `${Date.now()} - ${i}.pdf`,
        content: att,
        encoding: 'base64'
      })
    )
  }

  rsmq.sendMessage({ qname: "bp_emails", message: JSON.stringify(options) }, function (err, resp) {
    if (err) {
      logger.error(err)
      return
    }

    logger.info("bp_emails message sent ID:" + resp)
  })
}

module.exports = certificate