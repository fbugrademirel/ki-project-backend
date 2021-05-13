const mongoose = require('mongoose')

const analyteListSchema = new mongoose.Schema({

    analytes: [{
            analyte: {
                type: String,
                required: true,
                unique: true
            }
        }]
},{
    timestamps: true
})

const AnalyteNamingList = mongoose.model('AnalyteNamingList', analyteListSchema)

module.exports = AnalyteNamingList