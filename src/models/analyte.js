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

analyteSchema.virtual('analytes', {
    ref: 'OnBodyDevice',
    localField: '_id',
    foreignField: 'owner'
})

const Analyte = mongoose.model('Analyte', analyteSchema)

module.exports = Analyte