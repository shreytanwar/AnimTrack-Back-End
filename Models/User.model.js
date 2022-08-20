const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const List = require('../Models/List.model')

const userSchema = new Schema({
    name: {
        type: String,
        require: true,
        min: 6,
        max: 127
    },
    email: {
        type: String,
        require: true,
        min: 6,
        max: 127
    },
    password: {
        type: String,
        require: true,
        min: 6,
        max: 1023
    },
    date: {
        type: Date,
        default: Date.now
    },
    anime_list:[List.ListSchema]
});



const User = mongoose.model("User", userSchema)

module.exports = User