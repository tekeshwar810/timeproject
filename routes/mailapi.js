
var nodemailer = require('nodemailer');

function sendEmail() {

  // this.verifyMail = (email) => {

  //   var transporter = nodemailer.createTransport({
  //     service: 'gmail',
  //     auth: {
  //       user: 'tekeshwar810@gmail.com',
  //       pass: 'Gmail@4321'
  //     }
  //   });

  //   var mailOptions = {
  //     from: 'tekeshwar810@gmail.com',
  //     to: email,
  //     subject: 'Verrification Of Users',
  //     html: "<h1>This is user varification link</h1>Link = <a href='http://localhost:3000/verifyuser?email=" + email + "'>http://localhost:3000/verifyuser?email=" + email + "</a>"
  //   };

  //   transporter.sendMail(mailOptions, function (error, info) {
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       console.log('Email sent: ' + info.response);
  //     }
  //   });
  // }



  this.recoverPassword = (mailid) => {
    
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tekeshwar810@gmail.com',
        pass: 'Gmail@4321'
      }
    });

    var mailOptions = {
      from: 'tekeshwar810@gmail.com',
      to: mailid,
      subject: 'Verrification Of Users',
      html: "<div><h1>Your Password Reset Link Below</h1><a href='http://localhost:5000/updatepassword?mailid=" + mailid + "'>http://localhost:5000/updatepassword?mailid=" + mailid + "</a>"
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }

}
module.exports = new sendEmail