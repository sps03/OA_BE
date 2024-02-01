const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
// const authMiddleware = require('../middlewares/authMiddleware');

router.post('/create-task',  taskController.createTask);
router.post('/create-subtask/:task_id',  taskController.createSubTask);
router.get('/user-tasks',  taskController.getUserTasks);
router.get('/user-subtasks/:task_id?',  taskController.getUserSubTasks);
router.patch('/update-task/:task_id',  taskController.updateTask);
router.patch('/update-subtask/:subtask_id',  taskController.updateSubTask);
router.delete('/delete-task/:task_id',  taskController.deleteTask);
router.delete('/delete-subtask/:subtask_id',  taskController.deleteSubTask);

module.exports = router;