const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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

    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },

    password: {
        type: String,
        required: true,
        trim: true,
        regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/,
        minlength: 6,
        validate(value) {
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot be "password"!')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.virtual('onbodydevices', {
    ref: 'OnBodyDevice',
    localField: '_id',
    foreignField: 'owner'
})

/**
 * These method is added to schema methods and related to object instance
 */

userSchema.methods.generateAuthorizationToken = async function () {
    const token = jwt.sign({_id: this._id.toString()}, 'ki-kth-project')
    this.tokens = this.tokens.concat({ token })
    await this.save()
    return token
}

/**
 * delete the password and tokens field from the object to send back public data
 * @returns {*}
 */
userSchema.methods.getPublicData = function () {
    const userObject = this.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}


/**
 * This method is added to schema statics and related to data model
 * @param email
 * @param password
 * @returns {Promise<*>}
 */
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