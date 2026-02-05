import jwt from 'jsonwebtoken';
import Session from '../models/Session.js';

async function auth(req, res, next){
    
    const header = req.headers.authorization;

    if(!header){
        return res.status(401).json({message: 'нет  access токена'});
    };

    const token = header.split(' ')[1]; //bearer token

    try{
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    
        //проверка, что сессия для этого access существует
        const session = await Session.findByPk(decoded.sessionId);
        if(!session){
            return res.sendStatus(401).json({ message: 'Сессия не найдена' })
        }

        req.user = decoded;

        next();
    } catch(err){
        return res.status(401).json({ message : 'Auth failed' });
    }
}


export { auth };