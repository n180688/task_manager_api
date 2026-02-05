import { Router } from "express";
import  Task  from "../models/Task.js";
import { checkTaskOwner } from "../middlewares/checkTaskOwner.js";
import { validateTaskCreate, validateTaskPatch } from "../middlewares/validateTask.js";
import { checkCategoryAccess } from "../middlewares/checkCategoryAccess.js";

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
router.get('/:id', checkTaskOwner, async(req, res)=>{
    try {
        const task = req.task;
        return res.json(task);
    } catch (err) {
        return res.status(500).json({message: 'Ошибка'})
    }
});


//создание нового 
router.post('/', validateTaskCreate, checkCategoryAccess, async (req, res)=>{
    try {
        const userId = req.user.id;
        const {title, content, deadline, categoryId } = req.body;
        
        const data = {
            title, content, deadline, userId, categoryId
        }

        if(deadline && deadline < new Date()){
            data.status = 'expired'
        }
        const task = await Task.create(data);

            return res.status(201).json(task);
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Ошибка создания задачи'});
    }
});



//обновить задачу (частично)
router.patch('/:id', checkTaskOwner, validateTaskPatch, checkCategoryAccess, async(req, res) => {
    try {
        const task = req.task;
        const fields = req.validatedData;
        
        task.set(fields);

        if(task.deadline && 
            task.deadline < new Date() && 
            task.status !== 'done'){
            task.status = 'expired';
        }
       
        await task.save();
        return res.json(task);

    } catch (err) {
        return res.status(500).json({message: 'Ошибка обновления задачи (patch)'});
    }
});



//обновить задачу (полностью)
// router.put('/:id', checkTaskOwner, async(req, res) => {
//     try {
//         const task = req.task;
       
//         const {title, content, status, deadline } = req.body;
//         if(title !== undefined) task.title = title;
//         if(content !== undefined) task.content = content;
//         if(status !== undefined) task.status = status;
//         if(deadline !== undefined) task.deadline = deadline;

//         await task.save();
//         return res.json(task);

//     } catch (err) {
//         return res.status(500).json({message: 'Ошибка обновления задачи'});
//     }
// });


//удалить задачу
router.delete('/:id', checkTaskOwner, async(req,res) => {
    try {
        const task = await req.task;
       
        await task.destroy();
        return res.json({message: 'Удалено'});

    } catch (err) {
        console.log(err);
        return res.status(500).json({message: 'Ошибка удаления'});
    }
});



export default router;