import express from 'express';
const router = express.Router();
import Task from '../models/Task.js';

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
    priority: req.body.priority,
    category: req.body.category,
    assignedTo: req.body.assignedTo,
    estimatedTime: req.body.estimatedTime,
    status: req.body.status,
    comments: req.body.comments,  
    createdAt: new Date(),
    updatedAt: new Date()
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single task
router.get('/:id', getTask, (req, res) => {
  res.json(res.task);
});

// Update a task
router.patch('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    Object.assign(task, req.body);
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  console.log(`Delete request received for task ID: ${req.params.id}`);
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      console.log('Task not found');
      return res.status(404).json({ message: 'Task not found' });
    }
    await Task.deleteOne({ _id: req.params.id });
    console.log('Task deleted');
    res.json({ message: 'Deleted Task' });
  } catch (err) {
    console.error('Error deleting task:', err.message);
    res.status(500).json({ message: err.message });
  }
});

async function getTask(req, res, next) {
  let task;
  try {
    task = await Task.findById(req.params.id);
    if (task == null) {
      return res.status(404).json({ message: 'Cannot find task' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.task = task;
  next();
}

export default router;