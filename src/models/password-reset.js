const mongoose = require('mongoose')

const passwordResetSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },

    code: {
        type: String,
        required:true
    }

}, {
    timestamps: true
})

const PasswordResetToken = mongoose.model('password-reset-token', passwordResetSchema)

module.exports = PasswordResetToken