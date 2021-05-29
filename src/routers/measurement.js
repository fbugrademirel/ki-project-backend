const express = require('express')
const Measurement = require('../models/measurement')

const router = express.Router()
const endpoint = '/measurement'

router.post(endpoint, async (req, res) => {

    try {
        await Measurement.insertMany(req.body)
        res.status(201).send()
    } catch (e) {
        res.status(500).send(e.message)
    }
})

module.exports = router
