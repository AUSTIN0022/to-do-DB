const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    task: {
        type: String,
    },
    createAt: {
        type: Date,
        default: Date.now()
    },
    owner : {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    done: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Todos",  todoSchema);
