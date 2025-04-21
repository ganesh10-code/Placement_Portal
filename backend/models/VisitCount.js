const mongoose = require('mongoose');

const visitCountSchema = new mongoose.Schema({
  count: {
    type: Number,
    required: true,
    default: 0,
  },
});

const VisitCount = mongoose.model('VisitCount', visitCountSchema);

module.exports = VisitCount;
