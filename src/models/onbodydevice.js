const mongoose = require('mongoose')

const onBodyDeviceSchema = mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    personalID: {
        type: Number,
        required: true,
        unique: true
    },
    deviceID: {
      type: String,
      required: true,
      unique: true
    }
}, {
    timestamps: true
})

onBodyDeviceSchema.virtual('analytes', {
    ref: 'Analyte',
    localField: '_id',
    foreignField: 'owner'
})

const OnBodyDevice = mongoose.model('OnBodyDevice', onBodyDeviceSchema)

module.exports = OnBodyDevice