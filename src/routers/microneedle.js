const express = require('express')
const router = new express.Router('/analyte')
const Microneedle = require('../models/microneedle')
const verifyOwner = require('../middleware/verify')
const endPoint = '/microneedle'

router.post(endPoint, verifyOwner, async (req, res) => {

    const microneedle = new Microneedle(req.body)

    try {
        await microneedle.save()
        res.status(201).send(microneedle)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.patch(endPoint + '/:id', async (req, res) => {

    const allowedOperations = ['measurements', 'calibrationParameters']
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every((key) => allowedOperations.includes(key))

    if (!isValidOperation) {
        return res.status(400).send('Invalid operation')
    }

    try {
        const microNeedle = await Microneedle.findById(req.params.id)

        if(!microNeedle) {
            return res.status(404).send('Microneedle could not be found by id: '+ req.params.id)
        }

        if(updates.includes('measurements')) {
            microNeedle.measurements = microNeedle.measurements.concat(req.body['measurements'])
        }
        if(updates.includes('calibrationParameters')) {
            microNeedle.calibrationParameters = req.body['calibrationParameters']
        }

        await microNeedle.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get(endPoint + '/all', async (req, res) => {
    try {
        const microNeedle = await Microneedle.find({})
        res.status(200).send(microNeedle)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get(endPoint + '/:id', async (req, res) => {

    try {
        const microNeedle = await Microneedle.findById(req.params.id)

        if (!microNeedle) {
            res.status(404).send('Microneedle could not be found by id: '+ req.params.id)
        } else {
            res.status(200).send(microNeedle)
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.delete( endPoint + '/:id', async (req,res) => {

    try {
        const deletedMicroNeedle = await Microneedle.findByIdAndDelete(req.params.id)
        if(!deletedMicroNeedle) {
            res.status(404).send('Microneedle could not be found by id: '+ req.params.id)
        } else {
            res.status(200).send(deletedMicroNeedle)
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
})

module.exports = router
