const OnBodyDevice = require('../models/onbodydevice')

const verify = async (req, res, next) => {
    try {
        const device = await OnBodyDevice.findById(req.body.owner)
        if (!device) {
            throw new Error()
        }
        next()
    } catch (e) {
        res.status(404).send('No device found in the database for the owner id: ' + req.body.owner)
    }
}

module.exports = verify