const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  name: { type: String, required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true, default: {} }
});

const dataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tables: [tableSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

dataSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Data', dataSchema);
