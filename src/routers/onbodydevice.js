const express = require('express')
const router = new express.Router('/onbodydevice')
const OnBodyDevice = require('../models/onbodydevice')
const Analyte = require('../models/analyte')

router.post('/onbodydevice', async (req, res) => {

    const device = new OnBodyDevice(req.body)

    try {
        await device.save()
        res.status(201).send(device)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/onbodydevice/all', async (req, res) => {
    try {
        const devices = await OnBodyDevice.find({})
        res.status(200).send(devices)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/onbodydevice/allanalytes/:id', async (req, res) => {

    try {
        const device = await OnBodyDevice.findById(req.params.id)
        if(!device) {
            return res.status(404).send('No device is found by provided id: ' + req.params.id )
        }
        await device.populate('analytes').execPopulate()
        res.status(200).send(device.analytes)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('onbodydevice/:id', async (req, res) => {

})

router.delete('/onbodydevice/:id',async (req, res) => {
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

