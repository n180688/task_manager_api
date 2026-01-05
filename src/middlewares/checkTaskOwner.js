import  Task  from "../models/Task.js";

async function checkTaskOwner(req, res, next){
    const taskId = Number(req.params.id);
    if(Number.isNaN(taskId)){
        return res.status(400).json({message: 'Invalid task id'});
    }

    const task = await Task.findByPk(taskId);
    if(!task){
        return res.status(404).json({ message: 'Task not found'});
    }

    if (task.userId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    req.task = task;
    next();

}

export { checkTaskOwner }

