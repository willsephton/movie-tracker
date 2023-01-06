const mongoose = require("mongoose");
const { Schema } = mongoose;

var MovieSchema = new Schema({
    name:String,
    synopsis:String,
    watched:String
},
{ timestamps: true }
);
 
module.exports = mongoose.model("Movie", MovieSchema);
