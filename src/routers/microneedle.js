const express = require('express')
const router = new express.Router('/analyte')
const Microneedle = require('../models/microneedle')
const Measurement = require('../models/measurement')
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

    const allowedOperations = ['calibrationParameters']
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

        if(updates.includes('calibrationParameters')) {
            microNeedle.calibrationParameters = req.body['calibrationParameters']
        }

        await microNeedle.save()
        res.status(200).send(microNeedle)

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

        const agg = await Measurement.aggregate([
            { "$match": { owner: microNeedle._id } },
            { "$sort": {time: - 1}},
            {
                "$project": {
                    "_id": "$_id",
                    "value": "$value",
                    "time" : {
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
            { "$sort": {"_id": -1}},
            {"$limit": 600}
        ])

        console.log(agg)

        if (!microNeedle) {
            res.status(404).send('Microneedle could not be found by id: '+ req.params.id)
        } else {
            await microNeedle.populate({
                path: 'measurements',
                options: {
                    sort : { time: -1 },
                  //  limit: 600,
                }
            }).execPopulate()
            const obj = microNeedle.toObject()
            obj.measurements = microNeedle.measurements
            res.status(200).send(obj)
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
            await Measurement.deleteMany({owner: deletedMicroNeedle._id})
            res.status(200).send(deletedMicroNeedle)
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
})

module.exports = router
