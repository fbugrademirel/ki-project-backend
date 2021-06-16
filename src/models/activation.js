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

const ActivationToken = mongoose.model('activation-token', activationCodeSchema)

module.exports = ActivationToken