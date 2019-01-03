const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    id:{type:String, required: true, unique:true},
    pw:{type:String, required: true},
    name:{type:String, required: true},
    birth:{type:String, required: true},
    gender:{type:String, required: true},
    email:{type:String, required: true},
    tier:{type:String, required: true},
    token:{type:String},
})

userSchema.statics.create = function(payload){
    const user = new this(payload)
    console.log(payload)
    return user.save()
}

userSchema.statics.findAll = function(){
    return this.find({})
}

userSchema.statics.delete = function(id) {
    return this.remove({id})
}

module.exports = mongoose.model('user', userSchema)