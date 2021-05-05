const express = require('express')
const router = new express.Router('/user')
const User = require('../models/user')

// Only sign-up and login route will be publicly available
// Log in get the token and then operate


/**
LOGIN
 */
router.post('/user/login', async (req, res) => {

    try {
        const user = await User.findByLoginInfo(req.body.email, req.body.password)
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

/**
 SIGN-UP
 */
router.post('/user', async (req, res) => {

    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

module.exports = router