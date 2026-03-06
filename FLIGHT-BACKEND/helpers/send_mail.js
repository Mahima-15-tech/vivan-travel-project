var nodemailer = require('nodemailer');
var http = require('http');
var url = require('url');
// console.log("Creating Transport")



function sendMail(to, subject, text = null, pdfFilePath = null) {

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: 'noreply@vivantravels.com',
            pass: 'spew nxpu wfbb tdxm'
        }
    });

    var mailOptions = {
        from: 'noreply@vivantravels.com',
        to: to,
        subject: subject,
        html: text,
        attachments: pdfFilePath ? pdfFilePath : []
    }
    // console.log("Sending mail")

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response)
        }
    })

}
function visasendMail(to, subject, text = null, pdfFilePath = null) {

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: "noreply@vivantravels.com",
            pass: "spew nxpu wfbb tdxm",
        },
    });

    var mailOptions = {
        from: 'noreply@vivantravels.com',
        to: to,
        subject: subject,
        html: text,
        attachments: pdfFilePath ? pdfFilePath : []
    }
    // console.log("Sending mail")

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            // console.log(error);
        } else {
            // console.log('Email sent: ' + info.response)
        }
    })

}
module.exports = { sendMail, visasendMail };