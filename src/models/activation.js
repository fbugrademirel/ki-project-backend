const mongoose = require('mongoose')

const activationCodeSchema = new mongoose.Schema({

    email: {
        required: true,
        type: String
    },

    code: {
        required: true,
        type: String
    }

}, {
    timestamps: true
})

const ActivationCode = mongoose.model('activationCode', activationCodeSchema)

module.exports = ActivationCode