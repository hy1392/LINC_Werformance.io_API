const mongoose = require("mongoose")

const historySchema = new mongoose.Schema({
    userId:{type:String, required: true,},
    title:{type:String, required: true,},
    date:{type:String, required: true},
    score:{type:String, required: true},
    dir:{type:String, required: true},
})

historySchema.statics.create = function (payload) {
    const history = new this(payload)
    console.log(payload)
    return history.save()
}

module.exports = mongoose.model('history', historySchema)