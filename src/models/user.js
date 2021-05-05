const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email format is invalid!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/,
        minlength: 6,
        maxlength: 16,
        validate(value) {
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot be "password"!')
            }
        }
    },

}, {
    timestamps: true
})

userSchema.statics.findByLoginInfo = async (email, password) => {
    const user = await User.findOne({ email })
    if(!user) {
        throw new Error('Unable to Login!')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
        throw new Error('Unable to Login!')
    }
    return user
}

userSchema.pre('save', async function(next) {

    if (this.isModified('password')) {
        try {
            this.password = await bcrypt.hash(this.password, 8)
        } catch (error) {
            console.log(error.message)
        }
    }
    next()
})

const User = mongoose.model('User', userSchema)
module.exports = User