const express = require('express')
const router = new express.Router('/analyte')
const Analyte = require('../models/analyte')

router.post('/analyte', async (req, res) => {

    const analyte = new Analyte(req.body)

    try {
        await analyte.save()
        res.status(201).send(analyte)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.patch('/analyte/:id', async (req, res) => {

    const allowedOperation = 'measurements'
    const updates = Object.keys(req.body)

    const isValidOperation = updates.every((key) => { return key === allowedOperation })
    if (!isValidOperation) {
        res.status(400).send('Invalid operation')
    }

    try {
        const analyte = await Analyte.findById(req.params.id)


        if(!analyte) {
            return res.status(404).send('Analyte could not be found by id: '+ req.params.id)
        }

        analyte.measurements = analyte.measurements.concat(req.body['measurements'])

        await analyte.save()
        res.status(200).send(analyte)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/analyte/all', async (req, res) => {
    try {
        const analytes = await Analyte.find({})
        res.status(200).send(analytes)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/analyte/:id', async (req, res) => {

    try {
        const analyte = await Analyte.findById(req.params.id)

        if (!analyte) {
            res.status(404).send('Analyte could not be found by id: '+ req.params.id)
        } else {
            res.status(200).send(analyte)
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.delete('/analyte/:id', async (req,res) => {

    try {
        const deletedAnalyte = await Analyte.findByIdAndDelete(req.params.id)
        if(!deletedAnalyte) {
            res.status(404).send('Analyte could not be found by id: '+ req.params.id)
        } else {
            res.status(200).send(deletedAnalyte)
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
})

module.exports = router
