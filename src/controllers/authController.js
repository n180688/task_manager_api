import User from "../models/User.js";
import Session from "../models/Session.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UniqueConstraintError, ValidationError } from "sequelize";

const { JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRES } = process.env;

 
function hashToken(token){
    return crypto.createHash('sha256').update(token).digest('hex');
}


async function register(req, res){
    try{
        const {login, password} = req.body;

        const hash = await bcrypt.hash(password, 10);

        const user = await User.create({login, password: hash});

        return res.status(201).json({
            message: 'Юзер создан',
            userId: user.id
        });

    } catch(err){

        if (err instanceof UniqueConstraintError) {
            return res.status(400).json({
            error: 'LOGIN_EXISTS',
            message: 'Login already taken'
                });
            }

        if (err instanceof ValidationError) {
            return res.status(400).json({
            error: 'VALIDATION_ERROR',
            message: err.errors[0].message
                });
            }

        return res.status(500).json({ message: err.message });

    }
}


async function login(req, res){
    try{
         const { login, password } = req.body;
         const user = await User.findOne({ where: { login }});

        if(!user){
            return res.status(400).json({message: 'User not found'});
        }

        const ok = await bcrypt.compare(password, user.password);

        if (!ok) {
            return res.status(400).json({message: 'Неправильный пароль'})
        };


        //генерация access 
         const access = jwt.sign( {
            id: user.id,
            username: user.login
        }, JWT_ACCESS_SECRET, {
            expiresIn: JWT_ACCESS_EXPIRES
        });

        //refresh
        const refresh = crypto.randomBytes(64).toString('hex');
        const refreshHash = hashToken(refresh);


        //создание новой сессии
        await Session.create({
            userId: user.id,
            refreshToken: refreshHash,
            expiresAt: new Date(Date.now() + 30*60*60*24*1000),
            userAgent: req.headers["user-agent"],
            ip: req.ip
        });

        res.cookie("refresh", refresh, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 30*60*60*24*1000
        });

        return res.json({message: 'Успех', access});

    } catch(err) {
        console.log(err);
        return res.status(400).json({message: 'Ошибка логина'})
    }
}

//обновление access токена по refresh:
async function refresh(req, res){
    const refresh = req.cookies.refresh;
    if(!refresh) return res.status(401).json({ message: "No refresh token" });

    const refreshHash = hashToken(refresh);


    const session = await Session.findOne({where: { refreshToken: refreshHash }});
    if(!session){
        res.clearCookie('refresh');
        return res.status(403).json({ message: "Session not found" });
    }

    if(session.expiresAt < new Date()){
        await session.destroy();
        res.clearCookie('refresh');
        return res.status(401).json({ message: "Refresh истек" });
    }


    try {
            const newAccess = jwt.sign(
                        {
                    id: session.userId,
                    username: session.login
                }, JWT_ACCESS_SECRET, {
                    expiresIn: JWT_ACCESS_EXPIRES
                }
            );
            console.log(newAccess);
        return res.json({ access: newAccess })

    } catch (err) {
        console.log(err);
        await session.destroy();
        res.clearCookie('refresh');
        return res.status(401).json({message: "Refresh expired"});
    }
}


async function logout(req,res){
    const refreshToken = req.cookies.refresh;
    if(!refreshToken){
        return res.sendStatus(204);
    }

    const refreshHash = hashToken(refreshToken);
    await Session.destroy({where: {refreshToken: refreshHash}});

    res.clearCookie('refresh');
    return res.sendStatus(204);
}

export { 
    register,
    login,
    refresh, 
    logout
};
