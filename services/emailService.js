const nodemailer = require("nodemailer");
const User = require("../models/user");
const { from } = require("form-data");

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendverificationemail = async (email, vereficationlink) => {
  const mailoption = {
    from: process.env.EMAIL,
    to: email,
    subject: "Verify your email",
    html: `<h3>Verify Your Email</h3>
    <p>Please click the following link to verify your email address:</p>
    <a href="${vereficationlink}">Verify Email</a>`,
  };
  try {
    await transport.sendMail(mailoption);
    console.log("verification emaol sent to", email);
  } catch (error) {
    console.log("error sending verification email", error);
  }
};


const sendEmail = async (email, subject, html) => {
    const transport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      html: html,
    };
  
    try {
      await transport.sendMail(mailOptions);
      console.log(`Email sent to ${email}`);
    } catch (error) {
      console.log("Error sending email", error);
      throw error;
    }
  };
module.exports = { sendverificationemail,sendEmail };
