const ActivationCode = require('../models/activation')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

exports.sendEmailVerificationEmail = async function (req, user) {

    const secretCode = jwt.sign({_id: user._id.toString()}, 'auth',{expiresIn: '10 minutes'})
    const activationCode = new ActivationCode({email: req.body.email, code: secretCode})
    await activationCode.save()

    const smtpTransport = nodemailer.createTransport({ service: 'Gmail',
        auth: { user: 'ki.kth.project@gmail.com',
            pass: 'Oaprnwi75.' }});

    const mailOptions = { from: 'no-reply@example.com',
        to: user.email, subject: 'Account activation link',
        text: 'Hello researcher! '+ req.body.email +',\n\n'
            + 'Please verify your account by clicking the link: \nhttp:\/\/' +
            req.headers.host + '\/activation\/'
            + user.email
            + '\/' + activationCode.code
            + '\n\nThank you!\n' };
    await smtpTransport.sendMail(mailOptions)
}