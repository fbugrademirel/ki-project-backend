const express = require('express')
const router = new express.Router('/onbodydevice')
const OnBodyDevice = require('../models/onbodydevice')
const Analyte = require('../models/microneedle')
const auth = require('../middleware/auth')
const endPoint = '/onbodydevice'

/**
 * --- AUTHENTICATED--- ------> Connected to App
 */
router.post(endPoint, auth, async (req, res) => {

    const device = new OnBodyDevice({
        ...req.body,
        owner: req.user._id
    })

    try {
        await device.save()
        res.status(201).send(device)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

/**
 * ---  AUTHENTICATED -------> Connected to APP
 */
router.get(endPoint + '/all', auth, async (req, res) => {
    try {
        const devices = await OnBodyDevice.find({owner: req.user._id})
        res.status(200).send(devices)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

/**
 * ---AUTHENTICATED---------> Connected to App
 */
router.get(endPoint + '/allmicroneedles/:id', auth, async (req, res) => {

    try {
        const device = await OnBodyDevice.findById(req.params.id)
        if(!device) {
            return res.status(404).send('No device is found by provided id: ' + req.params.id )
        }
        await device.populate('microneedles').execPopulate()
        res.status(200).send(device.microneedles)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

/**
 * ---AUTHENTICATED---
 */
router.get(endPoint + '/:id', auth, async (req, res) => {

    try {
        const device = await OnBodyDevice.findById(req.params.id)
        if (!device) {
            res.status(404).send('No device is found by the id: ' + req.params.id )
        } else {
            res.status(200).send(device)
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
})

/**
 * ---AUTHENTICATED---
 */
router.patch(endPoint + '/:id', auth, async (req, res) => {

    const allowedOperations = ['name', 'personalID']
    const updates = Object.keys(req.body)

    const isValidOperation = updates.every((elem) => {
       return allowedOperations.includes(elem)
    })

    if (!isValidOperation) {
        return res.status(400).send('Invalid operation')
    }

    try {
        const device = await OnBodyDevice.findById(req.params.id)

        if (!device) {
            return res.status(404).send('Device could not be found by id: ' + req.params.id)
        }

        updates.forEach((update) => {
            device[update] = req.body[update]
        })

        await device.save()
        res.status(200).send(device)

    } catch (e) {
        res.status(500).send(e.message)
    }
})

/**
 * ---AUTHENTICATED---------> Connected to App
 */
router.delete(endPoint + '/:id', auth, async (req, res) => {
    try {
        const deletedDevice = await OnBodyDevice.findByIdAndDelete(req.params.id)
        if (!deletedDevice) {
            res.status(404).send('Device is not found by id: ' + req.params.id)
        } else {
            await Analyte.deleteMany({owner: deletedDevice._id})
            res.status(200).send(deletedDevice)
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
})

module.exports = router

