const express = require('express')
const router = new express.Router('/onbodydevice')
const OnBodyDevice = require('../models/onbodydevice')
const Microneedle = require('../models/microneedle')
const Measurement = require('../models/measurement')
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
        } else {
            if (req.query.interval === 'seconds' || req.query.interval === undefined) {
                await device.populate({
                    path: 'microneedles',
                    populate: {
                        path: 'measurements',
                        model: 'Measurement',
                        select: 'time value -owner -_id',
                        options: {
                            limit: 600,
                            sort : { time: -1 },
                        },

                    }
                }).execPopulate()

                const updatedMicroneedlesToBeSendBack = []

                for (let i = 0; i < device.microneedles.length; i++) {
                    let objForm = device.microneedles[i].toObject()
                    objForm["measurements"] = device.microneedles[i].measurements
                    updatedMicroneedlesToBeSendBack.push(objForm)
                }
                return res.status(200).send(updatedMicroneedlesToBeSendBack)

            } else if (req.query.interval === 'minutes') {

                await device.populate('microneedles').execPopulate()
                const updatedMicroneedlesToBeSendBack = []

                for (let i = 0; i < device.microneedles.length; i++) {
                    const agg = await Measurement.aggregate([
                        {
                            $match: { owner: device.microneedles[i]._id }
                        },
                        {
                            $sort: {time: 1}
                        },
                        {
                            $project: {
                                _id: "$_id",
                                value: "$value",
                                time : {
                                    $dateFromString: {
                                        dateString: {
                                            $dateToString: {
                                                date: {
                                                    $toDate: {
                                                        $multiply: ["$time", 1000]
                                                    }
                                                }, format: "%Y-%m-%dT%H:%M"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $group: {
                                _id: "$time",
                                value: { $first:"$value"}
                            }
                        },
                        { "$sort": {"_id": 1}},
                        {"$limit": 600}
                    ])

                    let objForm = device.microneedles[i].toObject()
                    objForm.measurements = []
                    agg.forEach( m => {
                        const entry = {
                            time: new Date(m._id).getTime() / 1000,
                            value: m.value
                        }
                        objForm.measurements.push(entry)
                    })
                    updatedMicroneedlesToBeSendBack.push(objForm)
                }
                return res.status(200).send(updatedMicroneedlesToBeSendBack)
            } else {
                return res.status(400).send('Bad URL request')
            }
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
})

/**
 * ---AUTHENTICATED---------> Connected to App
 */
router.get(endPoint + '/onlyallmicroneedles/:id', auth, async (req, res) => {

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
            const toBeDeleted = await Microneedle.find({owner: deletedDevice._id})
            await Microneedle.deleteMany({ owner: deletedDevice._id })
            for (const mns of toBeDeleted) {
                await Measurement.deleteMany( { owner: mns._id })
            }
            res.status(200).send(deletedDevice)
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
})

module.exports = router

