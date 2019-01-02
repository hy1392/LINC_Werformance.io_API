const mongoose = require("mongoose")

const analysisSchema = new mongoose.Schema({
    userId:{type:String, required: true,},
    title:{type:String, required: true,},
    date:{type:String, required: true},
    dir:{type:String, required: true},
})

analysisSchema.statics.create = function (payload) {
    const analysis = new this(payload)
    console.log(payload)
    return analysis.save()
}

module.exports = mongoose.model('analysis', analysisSchema)