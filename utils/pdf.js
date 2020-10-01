const PDFDocument = require('pdfkit')
const { Base64Encode } = require('base64-stream')
const fs = require('fs')
const https = require('https')

const logger = require('./logger')

exports.certificate = (name, serial, tonnes, date, image, toDisk) => new Promise((resolve, reject) => {
  const doc = new PDFDocument
  let finalString = ''

  https.get(image, (resp) => {
    resp.setEncoding('base64')
    body = `data:${resp.headers['content-type']};base64,`
    resp.on('data', (data) => { body += data })
    resp.on('end', () => {

      // stream to return either a base64 encoded or write to disk
      const stream = toDisk
        ? doc.pipe(fs.createWriteStream(`${__dirname}/../pdf/${name}-${Date.now()}.pdf`))
        : doc.pipe(new Base64Encode())

      // doc.image(`${__dirname}/../temp/images/cert.jpg`, 0, 0, { width: 612 })
      doc.image(`${body}`, 0, 0, { width: 612 })

      doc.font(`${__dirname}/../assets/fonts/nexarustsans-black.otf`).fillColor('white').fontSize(28).text(name, 0, 580, { width: 612, align: 'center' })
      doc.font(`${__dirname}/../assets/fonts/nexarustsans-book.otf`).fillColor('gray').fontSize(7).text(`PURCHASE ${tonnes} TONNE(S) OF CO2`, 223, 665, { align: 'left' })
      doc.font(`${__dirname}/../assets/fonts/nexarustsans-book.otf`).text(`DATE ${date}`, 390, 665)
      doc.font(`${__dirname}/../assets/fonts/nexarustsans-book.otf`).text(`CERTIFICATE ID# ${serial.startsWith('P-') ? 'PROVISIONAL ' + serial : serial}`, 223, 690)


      doc.end()
      stream.on('data', chunk => finalString += chunk)
      // stream.on('end', () => resolve(finalString))
      stream.on('finish', () => resolve(finalString))
      stream.on('error', () => reject('Error generating pdf'))
    })
  }).on('error', (e) => {
    logger.error(`Got error: ${e.message}`);
  })
})


exports.detailedReport = (file, content, header, toDisk) => new Promise((resolve, reject) => {
  const doc = new PDFDocument
  const headers = []
  const subheaders = []
  let finalString = ''

  const stream = doc.pipe(new Base64Encode())

  doc.font('Helvetica')

  doc.font('Helvetica-Bold').fontSize(20).text(header, { underline: true, align: 'center' }).moveDown(2)

  content.forEach(r => {
    if (!headers.includes(r.name)) {
      doc.font('Helvetica-Bold').fontSize(16).text(r.name, { underline: false }).moveDown(0.5)
      headers.push(r.name)
    }
    r.detailed.forEach(d => {
      if (!subheaders.includes(d.name)) {
        doc.font('Helvetica').fontSize(13).text(d.name, { underline: true }).moveDown(0.5)
        subheaders.push(d.name)
      }

      doc.fontSize(11).text(`value: ${d.value}`)
      doc.text(`unit: ${d.unit}`)
      doc.text(`factor: ${d.factor}`)
      doc.text(`source: ${d.source}`).moveDown(2)


    })
  })

  doc.end()
  stream.on('data', chunk => finalString += chunk)
  stream.on('end', () => resolve(finalString))
  stream.on('error', () => reject('Error generating pdf'))
})

exports.quotation = (file, content, header, toDisk) => new Promise((resolve, reject) => {
  const doc = new PDFDocument
  const headers = []
  let finalString = ''

  const stream = doc.pipe(new Base64Encode())

  doc.font('Helvetica')

  doc.font('Helvetica-Bold').fontSize(20).text(header, { underline: true, align: 'center' }).moveDown(2)

  content.forEach(r => {
    doc.font('Helvetica-Bold').fontSize(16).text(r.title, { underline: false }).moveDown(0.5)
    doc.fontSize(11).text(`value: ${r.value}`).moveDown(2)

  })


  doc.end()
  stream.on('data', chunk => finalString += chunk)
  stream.on('end', () => resolve(finalString))
  stream.on('error', () => reject('Error generating pdf'))
})


