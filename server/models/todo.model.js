import mongoose from 'mongoose'

const Schema = mongoose.Schema

/**
 * Todo Schema
 */
const Todo = new Schema ({
  message: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  due_date: {
    type: Date,
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

Todo.set ('toJSON', {getters: true, virtuals: false})

const TodoModel = mongoose.model ('Todo', Todo)

export default TodoModel