const mongoose = require('mongoose')

const analyteSchema = new mongoose.Schema({

    description: {
        type: String,
        required: true
    },

    uniqueIdentifier: {
        type: String,
        required: true,
        unique: true
    },

    measurements: [
        {
            time: {
                type: String,
                required: true
            },
            value: {
                type: Number,
                required: true
            }
    }]
}, {
    timestamps: true
})

const Analyte = mongoose.model('analyte', analyteSchema)

module.exports = Analyte