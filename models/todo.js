var mongoose = require('mongoose');

var schema = mongoose.Schema({
  done: {
    type: Boolean,
    required: true
  },
  priority: {
    type: Number,
    set: function (v) { return Math.round(v); }, // enforce integer
    required: true
  },
  text: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'User',
    index: true
  }
});

exports.Todo = mongoose.model('Todo', schema);
