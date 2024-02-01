const Task = require('../models/Task');
const SubTask = require('../models/subTask');


// 1. Create Task
const createTask = async (req, res) => {
  try {
    const { title, description, due_date } = req.body;
    const userId = req.userId;

    
    const priority = calculatePriority(due_date);

    const task = new Task({
      title,
      description,
      due_date,
      priority,
      // user: userId,
    });

    await task.save();

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 2. Create Sub Task
const createSubTask = async (req, res) => {
  try {
    const { task_id } = req.params;

    const subTask = new SubTask({
      task_id,
    });

    await subTask.save();

    res.status(201).json({ message: 'SubTask created successfully', subTask });
  } catch (error) {
    console.error('Error creating subtask:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 3. Get All User Tasks
const getUserTasks = async (req, res) => {
  try {
    const { priority, due_date, page, limit } = req.query;
    const userId = req.userId; 
    const query = { user: userId };

    if (priority) {
      query.priority = priority;
    }

    if (due_date) {
      query.due_date = { $gte: new Date(due_date) };
    }

    const tasks = await Task.find(query)
      .sort({ due_date: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 4. Get All User Sub Tasks
const getUserSubTasks = async (req, res) => {
  try {
    const { task_id } = req.params;
    const userId = req.userId; 

    const query = { task_id };

    if (userId) {
      query.user = userId;
    }

    const subTasks = await SubTask.find(query);

    res.status(200).json({ subTasks });
  } catch (error) {
    console.error('Error fetching user subtasks:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const updateTask = async (req, res) => {
  try {
    const { task_id } = req.params;
    const { due_date, status } = req.body;

    console.log('Received request body:', req.body);

    const task = await Task.findByIdAndUpdate(
      task_id,
      { due_date, status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    console.log('Updated Task:', task);
    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = updateTask;


// 6. Update SubTask
const updateSubTask = async (req, res) => {
  try {
    const { subtask_id } = req.params;
    const { status } = req.body;

    const subTask = await SubTask.findByIdAndUpdate(
      subtask_id,
      { status },
      { new: true }
    );

    if (!subTask) {
      return res.status(404).json({ message: 'SubTask not found' });
    }

    res.status(200).json({ message: 'SubTask updated successfully', subTask });
  } catch (error) {
    console.error('Error updating subtask:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// 7. Delete Task (Soft Deletion)
const deleteTask = async (req, res) => {
  try {
    const { task_id } = req.params;

    const task = await Task.findByIdAndDelete(task_id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await SubTask.deleteMany({ task_id });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// 8. Delete SubTask (Soft Deletion)
const deleteSubTask = async (req, res) => {
  try {
    const { subtask_id } = req.params;

    const subTask = await SubTask.findByIdAndDelete(subtask_id);

    if (!subTask) {
      return res.status(404).json({ message: 'SubTask not found' });
    }

    res.status(200).json({ message: 'SubTask deleted successfully' });
  } catch (error) {
    console.error('Error deleting subtask:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



module.exports = {
  createTask,
  createSubTask,
  getUserTasks,
  getUserSubTasks,
  updateTask,
  updateSubTask,
  deleteTask,
  deleteSubTask,
};