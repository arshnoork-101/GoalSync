/*
Nodemailer is a module for Node.js applications that allows easy email sending. It's like a mailman for your code!
A single module with zero dependencies – easy to audit the code with no hidden complexities
Unicode support to use any characters, including emoji 💪
Attach Attachments to emails and Embed Images in HTML emails so your design doesn’t get blocked.(Streamed in binary)
Secure.
Process to send an email:
1) Create a Nodemailer transporter using either SMTP or another transport method
2) Set up your message options (who sends(Gmail/Outlook,etc) what(subject+msg) to whom(recipient))
3) Deliver the message using the sendMail() method of your transporter
*/

// 1) npm install nodemailer
// 2) This imports the Nodemailer module so that you can use it in your app. Also, receive it in a constant variable called nodemailer.
const nodemailer=require("nodemailer");
// 3) Create a transporter(mailman)
const transporter=nodemailer.createTransport({
    // SMTP set up starts
    host: 'smtp.gmail.com', // SMTP server (for Gmail)
    port: 587,              
    secure: false, 
    // SMTP set up ends
    // Gmail to use to send the emails(Gmail/Yahoo/Outlook)
    service:'gmail',
    // From your which gmail account(Sender)
    auth:{
        user:'arshnoorkaur@gmail.com',
        pass:'Arshnoor' // Nodemailer will authenticate and log-in on our behalf
    }
});
// 4) Set Email Options
let mailOptions = {
    // Definition of the email
    from: 'arshnoorkaur@gmail.com',
    to: 'arshnoorkaur@gmail.com', // Comma separated list or array of email addresses
    subject: 'Hello from Nodemailer',
    text: 'This is a test email!',
    html: "<p>This is HTML version of the msg</p>"
};
// 5) Send the Email
// sendEmail() accepts 2 arguments:mailOptions, and a callback fx(It will run when the Email has been sent)
transporter.sendMail(mailOptions, function(error, info) {
    // Case 1: Error occurred
    if (error) {
      console.log(error);
    }
    // Case 2: Successfully sent
    // info is an object which is returned on successful attempt 
    // info.response is a success message that the email server returns which usually contains a status code, a human readable confirmation(OK), etc
    else {
      console.log('Email sent: ' + info.response);
    }
});

/* SMTP:
SMTP stands for Simple Mail Transfer Protocol.
Used to send emails from email clients to mail servers and between mail servers.
Components:
SMTP Server: The server that receives and processes emails. (Gmail, Yahoo, and Outlook offer SMTP servers.)
SMTP Client: The software or application that sends emails through the SMTP server.
How It Works:
The email client connects to an SMTP server when it sends an email.
The server authenticates the sender and forwards the email to the recipient’s server.
If error occurs, the server tries again later.
*/
  