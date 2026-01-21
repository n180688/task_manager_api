import { Router } from "express";
import  User from "../models/User.js";
import Session from "../models/Session.js";
import { UniqueConstraintError, ValidationError, Op } from "sequelize";

const router = Router();

router.get('/me', async(req, res)=>{
   try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'login', 'createdAt']
        });
        return res.json(user);
   } catch (err) {
        return res.status(500).json({ message: 'Failed to load user' })
   }
}); 

//изменение данных, пока только логин
router.patch('/me', async(req, res)=>{
    try { 
        const { login } = req.body; 
    
        if (login !== undefined) { 
            if (typeof login !== 'string' || !login.trim()) { 
                return res.status(400).json({ message: 'Invalid login' }); } 
            } 
        const user = await User.findByPk(req.user.id); 

        user.login = login.trim(); 

        await user.save(); 
        return res.json({ id: user.id, login: user.login }); 
    } catch (err) { 
        if (err.name === 'SequelizeUniqueConstraintError') { 
            return res.status(400).json({ message: 'Login already taken' }); 
        } 
        if (err instanceof ValidationError) {
            return res.status(400).json({
            error: 'VALIDATION_ERROR',
            message: err.errors[0].message
                });
            }
            return res.status(500).json({ message: err.mesage });
         }
});


router.get('/sessions', async(req, res)=>{
   try {
        const sessions = await Session.findAll({
            where: { userId: req.user.id },
            attributes: ['id', 'createdAt', 'userAgent', 'ip']
        });

        return res.json(sessions);
   } catch (err) {
        return res.status(500).json({ message: 'Failed to load sessions' })
   }
});


router.delete('/sessions/:id', async(req, res)=>{
   try {
        const session = await Session.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if(!session){
            return res.status(404).json({ message: 'Session not found' });
        }

        await session.destroy();
        return res.json({ message: 'Session removed' });
   } catch (err) {
        return res.status(500).json({ message: 'Failed to delete session' })
   }
});

//сброс всех сессий (кроме текущей)
router.delete('/sessions', async(req, res)=>{
   try {
        await Session.destroy({
            where: { 
                userId: req.user.id,
                id: {
                    [Op.ne]: req.user.sessionId
                }
             }
        });
        return res.json({ message: 'All sessions removed' });
   } catch (err) {
        return res.status(500).json({ message: 'Failed to delete sessions' })
   }
});


export default router;