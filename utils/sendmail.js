const nodemailer = require("nodemailer");
require('dotenv').config()

const sendEmail = async (email, subject, html) => {
    try {
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465, //Default is 587
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.NODE_MAILER_USER, // generated ethereal user
          pass: process.env.NODE_MAILER_PASSWORD, // generated ethereal password
        },
      });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: 'Fidia', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        // text: text, // plain text body
        html: html
      });
    
      console.log("Message sent: %s", info.messageId);
    
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.log('Email sending failed', err.message)
    }
  }

module.exports = sendEmail;