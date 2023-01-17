const mongoose = require("mongoose");
const { Schema } = mongoose;

var MovieSchema = new Schema({
    name: { type: String, required: [true, 'Name is required'], maxlength: [20, "Name must be less than 20 chars long"]},
    synopsis: { type: String, required: [true, 'Synopsis is required'], maxlength: [40, "Synopsis must be less than 40 chars long"]},
    review: { type: String, required: [true, 'Review is required'], maxlength: [20, "Review must be less than 20 chars long"]},
    watched: { type: String, required: [true, 'Watched is required'], maxlength: [20, "Watched must be less than 20 chars long"]},
},
{ timestamps: true }
);
 
module.exports = mongoose.model("Movie", MovieSchema);
