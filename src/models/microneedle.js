const mongoose = require('mongoose')

const mnSchema = new mongoose.Schema({

    description: {
        type: String,
        required: true
    },

    associatedAnalyte: {
        type: String,
        enum: ['sodium', 'pH', 'potassium', 'chloride'],
        required: true
    },

    uniqueIdentifier: {
        type: String,
        required: true,
        unique: true
    },

    calibrationParameters: {
        isCalibrated: {
            type: Boolean,
            required: true,
            default: false
        },
        calibrationTime: {
            type: Number,
            required: function () {
                return this.calibrationParameters.isCalibrated
            },
        },
        correlationEquationParameters: {
            slope: {
                type: Number,
                required: function () {
                    return this.calibrationParameters.isCalibrated
                },
            },
            constant: {
                type: Number,
                required: function () {
                    return this.calibrationParameters.isCalibrated
                },
            }
        }
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'OnBodyDevice'
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

const Microneedle = mongoose.model('Microneedle', mnSchema)

module.exports = Microneedle