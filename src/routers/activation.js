const express = require('express')
const router = new express.Router()
const ActivationCode = require('../models/activation')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

router.get('/verification/:email/:code', async (req, res) => {
    try {
        const activationCode = await ActivationCode.findOne({code: req.params.code})

        if(!activationCode) {
            return res.status(400).send('No activation code is found. Request another one!')
        }

        const decoded = jwt.verify(activationCode.code, 'auth')
        const user = await User.findOne({_id: decoded._id, email: req.params.email})

        if(user.isVerified) {
            return res.status(200).send('User is already verified! Please log in!')
        }

        if(!user) {
            return res.status(401).send('No user has been found. Please sign up!')
        }

        user.isVerified = true
        await user.save()
        await ActivationCode.deleteOne({code: req.params.code})
        res.status(201).send('Account successfully verified! Please log in!')

    } catch (e) {
        res.status(500).send(e.message)
    }
})

module.exports = router
