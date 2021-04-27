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

const OnBodyDevice = mongoose.model('OnBodyDevice', onBodyDeviceSchema)

module.exports = OnBodyDevice