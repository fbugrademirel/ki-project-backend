const mongoose = require('mongoose')
const AnalyteNamingList = require('./analyte-naming-list')
const fs = require('fs')

//This file read can be changed to a cloud bucket in later implementations
const fileContentOfAnalytes = fs.readFileSync('src/resources/analytes.txt', 'utf-8')
const analytes = fileContentOfAnalytes.split('\n')

const setAnalytesOnDatabase = async function() {
    try {
        const arr = []
        analytes.forEach(value => {
            const elem = '{"analyte": "' + value + '"}'
            arr.push(elem)
        })
        const json = '{"analytes": [' + arr.join(',') + ']}'

        const analyteNamingList = await AnalyteNamingList.findOneAndUpdate({}, JSON.parse(json), { new: true, useFindAndModify: false})

        if(!analyteNamingList) {
            const list = new AnalyteNamingList(JSON.parse(json))
            await list.save()
        }

    } catch (e) {
        console.log(e.message)
    }
}

setAnalytesOnDatabase().then().catch( e => {
    console.log(e.message)
})

const baseMNNaming = 'MN#'
const mnEnumsForSchema = []

for (let i = 1; i <= 200; i++) {
    const name = baseMNNaming + i
    mnEnumsForSchema.push(name)
}

const mnSchema = new mongoose.Schema({

    description: {
        type: String,
        enum: mnEnumsForSchema,
        required: true
    },

    associatedAnalyte: {
        type: String,
        enum: analytes,
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

mnSchema.index({description: 1, owner: 1}, {unique: true});


const Microneedle = mongoose.model('Microneedle', mnSchema)

module.exports = Microneedle