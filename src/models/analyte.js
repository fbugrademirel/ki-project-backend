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

    isCalibrated: {
        type: Boolean,
        required: true,
        default: false,
    },

    calibrationTime: {
        type: Number,
        required: function () {
            return this.isCalibrated
        },
    },

    calibrationParameters: {
        x: {
            type: Number,
            required: function () {
                return this.isCalibrated
            },
        },
        y: {
            type: Number,
            required: function () {
                return this.isCalibrated
            },
        },
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