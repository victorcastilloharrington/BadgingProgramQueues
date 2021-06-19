const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

const Email = (options) => {
  const gmail = {
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  };

  const transport = nodemailer.createTransport(gmail);

  // 1) Render HTML based on a pug template
  const html = pug.renderFile(
    `${__dirname}/../email/${options.template}.pug`,
    options.templateData
  );

  // Define email options
  let mailOptions = {
    from: "Stand For Trees Support <business@standfortrees.org>",
    to: options.to,
    subject: options.subject,
    text: htmlToText.fromString(html),
    cc: options.cc,
    html,
  };

  mailOptions.attachments = [
    {
      filename: "fb.png",
      path: `${__dirname}/../assets/images/fb.png`,
      cid: "fb",
    },
    {
      filename: "tw.png",
      path: `${__dirname}/../assets/images/tw.png`,
      cid: "tw",
    },
    {
      filename: "ig.png",
      path: `${__dirname}/../assets/images/ig.png`,
      cid: "ig",
    },
    {
      filename: "logo.png",
      path: `${__dirname}/../assets/images/logo.png`,
      cid: "logo",
    },
  ];

  if (options.attachments) mailOptions.attachments.push(options.attachments);

  //send Email
  return transport.sendMail(mailOptions);
};

module.exports = Email;
