import { Router } from "express";
import  Task  from "../models/Task.js";

const router = Router();

//получение всех задач
router.get('/', async(req, res)=>{
    try {
        const userId = req.user.id;
        const tasks = await Task.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
        });
        return res.json(tasks);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Ошибка получения задач' })
    }
});


//получение задачи по id 
router.get('/:id', async(req, res)=>{
    try {
        const userId = req.user.id;
        const id = parseInt(req.params.id, 10);
        const task = await Task.findByPk(id);
        
        if(!task) return res.status(404).json({ message: 'task not found'});

        if(task.userId !== userId) return res.status(403).json({message: 'Нет доступа'});
        return res.json(task);

    } catch (err) {
        return res.status(500).json({message: 'Ошибка'})
    }
});


//создание нового 
router.post('/', async (req, res)=>{
    try {
        const userId = req.user.id;
        const {title, content,deadline } = req.body;
        if(!title || title.trim() === '') return res.status(400).json({message: 'Нужен title'});

        const task = await Task.create({
            title: title.trim(),
            content: content || null,
            deadline: deadline || null,
            userId,
            status: 'pending' 
        })
            return res.status(201).json(task);
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Ошибка создания задачи'});
    }
});



//обновить задачу (частично)
router.patch('/:id', async(req, res) => {
    try {
        const userId = req.user.id;
        const id = parseInt(req.params.id, 10);
        const task = await Task.findByPk(id);
        const fields = req.body;
        if(!task) return res.status(404).json({message: 'Task not found'});
        if(task.userId !== userId) return res.status(403).json({message: 'Нет доступа'});
        if(!Object.keys(fields).length) return res.status(400).json({ message: "No fields to update" });
        

         task.set(fields);
       

        await task.save();
        return res.json(task);

    } catch (err) {
        return res.status(500).json({message: 'Ошибка обновления задачи (patch)'});
    }
});



//обновить задачу (полностью)
router.put('/:id', async(req, res) => {
    try {
        const userId = req.user.id;
        const id = parseInt(req.params.id, 10);
        const task = await Task.findByPk(id);
        if(!task) return res.status(404).json({message: 'Task not found'});
        if(task.userId !== userId) return res.status(403).json({message: 'Нет доступа'});

        const {title, content, status, deadline } = req.body;
        if(title !== undefined) task.title = title;
        if(content !== undefined) task.content = content;
         if(status !== undefined) task.status = status;
        if(deadline !== undefined) task.deadline = deadline;

        await task.save();
        return res.json(task);

    } catch (err) {
        return res.status(500).json({message: 'Ошибка обновления задачи'});
    }
});

//удалить задачу
router.delete('/:id', async(req,res) => {
    try {
         const userId = req.user.id;
        const id = parseInt(req.params.id, 10);
        const task = await Task.findByPk(id);
        if(!task) return res.status(404).json({message: 'Task not found'});
        if(task.userId !== userId) return res.status(403).json({message: 'Нет доступа'});

        await task.destroy();
        return res.json({message: 'Удалено'});

    } catch (err) {
        console.log(err);
        return res.status(500).json({message: 'Ошибка удаления'});
    }
});



export default router;