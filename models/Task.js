const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  due_date: { type: Date, required: true },
  priority: { type: Number, required: true },
  status: { type: String, enum: ['TODO', 'IN_PROGRESS', 'DONE'], default: 'TODO' },
  // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // deleted_at: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);