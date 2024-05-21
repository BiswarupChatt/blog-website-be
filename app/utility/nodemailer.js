const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.NODEMAILER_FROM_EMAIL,
        pass: process.env.NODEMAILER_FROM_PASSWORD
    }
})


const welcomeEmail = (userEmail, userName) => {
    const mailBody = {
        from: process.env.NODEMAILER_FROM_EMAIL,
        to: userEmail,
        subject: 'Welcome to TechTales! 🚀',
        html: `<p>Hello, ${userName}</p>
        <p>Welcome to <strong>TechTales</strong>! We are excited to have you.</p>`
    }

    transporter.sendMail(mailBody, (error, info) => {
        if (error) {
            console.log('Error While sending Registration Email', error.message)
        } else {
            console.log('Registration Email sent successfully', info.response)
        }
    })
}

module.exports = {welcomeEmail}