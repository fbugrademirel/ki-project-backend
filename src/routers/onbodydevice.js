const express = require('express')
const router = new express.Router('/onbodydevice')
const OnBodyDevice = require('../models/onbodydevice')

router.post('/onbodydevice', async (req, res) => {

    const device = new OnBodyDevice(req.body)

    try {
        await device.save()
        res.status(201).send(device)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

module.exports = router

