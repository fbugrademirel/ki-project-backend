const OnBodyDevice = require('../models/onbodydevice')

const verify = async (req, res, next) => {
    try {
        const device = await OnBodyDevice.findById(req.body.owner)
        if (!device) {
            throw new Error('No device with provided id is found!')
        }
        next()
    } catch (e) {
        res.status(404).send(e.message + req.body.owner)
    }
}

module.exports = verify