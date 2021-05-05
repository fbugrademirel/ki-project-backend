const express = require('express')
const router = new express.Router('/user')
const User = require('../models/user')
const auth = require('../middleware/auth')

// Only sign-up and login route will be publicly available and WILL NOT require authentication
// Log in get the token and then operate

//Client will provide auth token at the header as Authorization : Bearer <Token>



/**
 SIGN-UP
 */
router.post('/user', async (req, res) => {

    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthorizationToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e.message)
    }
})

/**
LOGIN
 */
router.post('/user/login', async (req, res) => {

    try {
        const user = await User.findByLoginInfo(req.body.email, req.body.password)
        const token = await user.generateAuthorizationToken()
        res.status(200).send({user, token})
    } catch (e) {
        res.status(400).send(e.message)
    }
})


/**
 * LOGOUT -- Req Authentication
 */

router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token // filter out the current token on the request
        })
        await req.user.save() // Save user with the filtered out token (With all remaining ones)
        res.status(200).send()
    } catch (e) {
        res.status(500).send(e.message)
    }
})

/**
 * READ Own Profile -- Req Authentication --
 */

router.get('/user/me', auth, async (req, res) => {
    try {
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send(e.message)
    }
})



module.exports = router