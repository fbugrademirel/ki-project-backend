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
            return res.status(404).send('No user has been found with the provided e-mail! Please sign up!')
        }
        if(user.isVerified) {
            return res.status(200).send('User is already verified! Please log in!')
        }

        await ActivationToken.deleteMany({email: req.params.email})

        await sendEmailVerificationEmail(req, user)
        res.status(200).send({"message":"Activation e-mail is sent to your address. Please check your mailbox!"})
    } catch (e) {
        res.status(500).send(e.message)
    }
})

// Activate account route
router.get('/activation/:email/:token', async (req, res) => {
    try {
        const activationToken = await ActivationToken.findOne({code: req.params.token})

        if(!activationToken) {
            return res.status(404).send('No activation code is found. Please request another one!')
        }

        const decoded = jwt.verify(activationToken.code, 'auth')
        const user = await User.findOne({_id: decoded._id, email: req.params.email})

        if(!user) {
            return res.status(404).send('No user has been found. Please sign up!')
        }

        if(user.isVerified) {
            return res.status(200).send('User is already verified! Please log in!')
        }

        user.isVerified = true
        await user.save()
        await ActivationToken.deleteOne({code: req.params.token})
        res.status(201).send({"message": "Account successfully activated! Please log in!"})

    } catch (e) {
        await ActivationToken.deleteOne({code: req.params.token})
        res.status(500).send(e.message + " Your activation code might be expired. Request another one!")
    }
})



module.exports = router
