const mongoose = require('mongoose')

const measurementSchema = new mongoose.Schema({

    time: {
        type: Number,
        required: true
    },

    value : {
        type: Number,
        required: true
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Microneedle'
    }

}, {
    timestamps: true
})

const Measurement = mongoose.model('Measurement', measurementSchema)

module.exports = Measurement