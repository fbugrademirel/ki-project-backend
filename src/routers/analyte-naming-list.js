const express = require('express')
const router = express.Router()
const AnalyteNamingList = require('../models/analyte-naming-list')
const auth = require('../middleware/auth')

const endpoint = '/analytenaminglist'

router.get(endpoint, auth, async (req, res) => {
    try {
        const list = await AnalyteNamingList.findById('609c6f72b6aa08a63bb4b3be')

        if(!list) {
            return res.status(400).send('List is null')
        } else {
            res.status(200).send(list)
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
})

module.exports = router


