const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const PasswordResetToken = require('../models/password-reset')
const {sendPasswordResetEmail} = require("../utils/mailer");

router.post('/password-reset/:email',async (req, res) => {

    try {
        const user = await User.findOne({ email: req.params.email })
        if (!user) {
            return res.status(400).send('No user is found with provided e-mail! Please sign up!')
        }
        await PasswordResetToken.deleteMany({ email: req.params.email })
        await sendPasswordResetEmail(req, user)

        res.status(200).send({"message": "A password reset link is sent to your e-mail address. Please check your mailbox!"})
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.post('/password-reset/:email/:token', async (req,res) => {

    try {
        const token = await PasswordResetToken.findOne({code: req.params.token})

        if (!token) {
            return res.status(400).send('No reset password token is found! Please request another one!')
        }

        const decoded = jwt.verify(token.code, 'password-reset')
        const user = await User.findOne({_id: decoded._id, email: req.params.email})

        if (!user) {
            return res.status(401).send('No user has been found. Please sign up!')
        }
        user.password = req.body.password
        await user.save()
        await token.delete()
        res.status(201).send({"message":"Password changed successfully!"})
    } catch (e) {
        res.status(500).send(e.message)
    }
})

module.exports = router