const mongoose = require("mongoose")
const Schema = mongoose.Schema
const constants = require("../routes/constants")

const ImageSchema = new Schema({
  img: {  },
  student: {
    type: String
  }
})

module.exports = Image = mongoose.model("image", ImageSchema)
