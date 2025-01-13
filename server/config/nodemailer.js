import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransporter({
    host: "smtp-relay.brevo.com",
    port: "587",
    auth: {
        user: process.env.SMTP_USER
    }

})


export default transporter;