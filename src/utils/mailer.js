const ActivationToken = require('../models/activation')
const PasswordResetToken = require('../models/password-reset')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')


exports.sendEmailVerificationEmail = async function (req, user) {

    const secretCode = jwt.sign({_id: user._id.toString()}, 'auth',{expiresIn: '5 minutes'})
    const activationCode = new ActivationToken({email: req.body.email, code: secretCode})
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

exports.sendPasswordResetEmail = async function (req, user) {

    const token = jwt.sign({_id: user._id.toString()}, 'password-reset', {expiresIn:'5 minutes'})
    const passwordResetToken = new PasswordResetToken({email: req.params.email, code: token})
    await passwordResetToken.save()

    const smtpTransport = nodemailer.createTransport({ service: 'Gmail',
        auth: { user: 'ki.kth.project@gmail.com',
            pass: 'Oaprnwi75.' }});

    const mailOptions = { from: 'no-reply@example.com',
        to: user.email, subject: 'Password reset link',
        text: 'Hello researcher! '+ user.email +',\n\n'
            + 'Please use the following link for password reset: \nhttp:\/\/' +
            req.headers.host + '\/password-reset\/'
            + user.email
            + '\/' + passwordResetToken.code
            + '\n\nThank you!\n' };
    await smtpTransport.sendMail(mailOptions)
}