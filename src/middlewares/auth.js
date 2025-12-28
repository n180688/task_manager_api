import jwt from 'jsonwebtoken';

function auth(req, res, next){
    
    const header = req.headers.authorization;

    if(!header){
        return res.status(401).json({message: 'нет токена'});
    };

    const token = header.split(' ')[1]; //bearer token

    try{
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    

        req.user = decoded;

        next();
    } catch(err){
        return res.status(401).json({ message : 'Access истек' });
    }
}


export { auth };