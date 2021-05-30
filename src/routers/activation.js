const express = require('express')
const router = new express.Router()
const ActivationToken = require('../models/activation')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const {sendEmailVerificationEmail} = require("../utils/mailer");

// Resend verification link route
router.get('/activation/request/:email', async (req,res) => {

    try {
        const user = await User.findOne({email: req.params.email})
        if(!user) {
            return res.status(400).send('No user has been found with the provided e-mail! Please sign up!')
        }
        if(user.isVerified) {
            return res.status(200).send('User is already verified! Please log in!')
        }

        await ActivationToken.deleteMany({email: req.params.email})

        await sendEmailVerificationEmail(req, user)
        res.status(200).send('Activation e-mail is sent to your address. Please check your mailbox!')
    } catch (e) {
        res.status(500).send(e.message)
    }
})

// Activate account route
router.get('/activation/:email/:code', async (req, res) => {
    try {
        const activationCode = await ActivationToken.findOne({code: req.params.code})

        if(!activationCode) {
            return res.status(400).send('No activation code is found. Please request another one!')
        }

        const decoded = jwt.verify(activationCode.code, 'auth')
        const user = await User.findOne({_id: decoded._id, email: req.params.email})

        if(!user) {
            return res.status(401).send('No user has been found. Please sign up!')
        }

        if(user.isVerified) {
            return res.status(200).send('User is already verified! Please log in!')
        }

        user.isVerified = true
        await user.save()
        await ActivationToken.deleteOne({code: req.params.code})
        res.status(201).send('Account successfully verified! Please log in!')

    } catch (e) {
        await ActivationToken.deleteOne({code: req.params.code})
        res.status(500).send(e.message + " Your activation code might be expired. Request another one!")
    }
})



module.exports = router
