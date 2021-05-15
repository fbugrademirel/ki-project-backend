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
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    intendedNumberOfNeedles: {
        type: Number,
        required: true,
        max: 200,
        min: 1
    }

}, {
    timestamps: true
})

onBodyDeviceSchema.virtual('microneedles', {
    ref: 'Microneedle',
    localField: '_id',
    foreignField: 'owner'
})

const OnBodyDevice = mongoose.model('OnBodyDevice', onBodyDeviceSchema)

module.exports = OnBodyDevice