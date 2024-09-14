const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Todos = require("./Todo.js")
const User = require("./User.js");

const listSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    category: String,
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    todos:[
        {
            type: Schema.Types.ObjectId,
            ref: "Todos",
        }
    ],
});



const List = mongoose.model("lists", listSchema);

module.exports = List;
