'use strict';
const nodemailer = require('nodemailer');

// // Generate test SMTP service account from ethereal.email
// // Only needed if you don't have a real mail account for testing
// nodemailer.createTestAccount((err, account) => {
//     // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//         host: 'smtp.ethereal.email',
//         port: 587,
//         secure: false, // true for 465, false for other ports
//         auth: {
//             user: account.user, // generated ethereal user
//             pass: account.pass // generated ethereal password
//         }
//     });

//     // setup email data with unicode symbols
//     let recieverAddress = 'susan@gmail.com'
//     let firstName = 'Susan'
//     let source = '"Bram" <' + process.env.EMAIL_FROM + '>'
//     let mailOptions = {
//         from: source,
//         to: recieverAddress, // list of receivers
//         subject: 'Thanks for Pledging!', // Subject line
//         attachments: [ {
//             filename: 'minimalism_tips.pdf',
//             path: './minimalism_tips.pdf'
//         }],
//         html: `
//         <h2>Thank You for Pledging, ${firstName}!</h2>
//         <p>Attached is a PDF that includes seven quick tips to help you get started with minimalism. Good luck!</p>
//         <p>Best,</p>
//         <p>Bram</p>
//         ` // html body
//     };

//     // send mail with defined transport object
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return console.log(error);
//         }
//         console.log('Message sent: %s', info.messageId);
//         // Preview only available when sending through an Ethereal account
//         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

//         // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
//         // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
//     });
// });



// setup email data with unicode symbols
exports.mailTo = (reciever, firstName) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS 
        }
    });

    let mailOptions = {
        from: '"Bram" <' + process.env.EMAIL_FROM + '>', // sender address
        to: [reciever], 
        subject: 'Thanks for Pledging!', // Subject line
        attachments: [ {
            filename: 'minimalism_tips.pdf',
            path: './minimalism_tips.pdf'
        }],
        html: `
        <h2>Thank You for Pledging, ${firstName}!</h2>
        <p>Attached is a PDF that includes seven quick tips to help you get started with minimalism. Good luck, and thank you again!</p>
        <p>Best,</p>
        <p>Bram</p>
        ` // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
}


var tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
// Thanks to:
// http://fightingforalostcause.net/misc/2006/compare-email-regex.php
// http://thedailywtf.com/Articles/Validating_Email_Addresses.aspx
// http://stackoverflow.com/questions/201323/what-is-the-best-regular-expression-for-validating-email-addresses/201378#201378
exports.validate = function(email)
{
	if (!email)
		return false;
		
	if(email.length>254)
		return false;

	var valid = tester.test(email);
	if(!valid)
		return false;

	// Further checking of some things regex can't handle
	var parts = email.split("@");
	if(parts[0].length>64)
		return false;

	var domainParts = parts[1].split(".");
	if(domainParts.some(function(part) { return part.length>63; }))
		return false;

	return true;
}
