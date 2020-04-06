const nodemailer = require("nodemailer");
const { gmailUser, gmailPass } = process.env;
const transportOptions = {
  
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: gmailUser,
    pass: gmailPass
  }
};

const mailTransport = nodemailer.createTransport(transportOptions);
const sendMailToUser = async (email, confirmToken) => {
  try {
    await mailTransport.sendMail({
      from: "mukeschaudharyh.gmail.com",
      to: email,
      subject: "Confirm your email",
      html: `
          <h1>Welcome to my application</h1>
          <p>Thanks for creating an account. Click 
            <a href=http://localhost:1234/confirm/${confirmToken}>here</a> to confirm your account. Or copy paste http://localhost:1234/confirm/${confirmToken} to your browser.
          </p>
        `
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = sendMailToUser;
