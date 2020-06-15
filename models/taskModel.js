const mongoose = require('mongoose')

const TaskSchema = mongoose.Schema({
  assignedTo: { type: mongoose.SchemaTypes.ObjectId },
  description: String,
  deliveryStatus: {
    default: false,
    type: Boolean
  },
  dueDate: String,
  deliveryDate: String

})

module.exports = mongoose.model('Task', TaskSchema)
