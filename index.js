
import express from 'express';
import cookieParser from 'cookie-parser';
import sequelize from './src/config/db.js';
import './src/models/index.js';
import userRoutes from './src/routes/users.js';
import taskRoutes from './src/routes/tasks.js';
import authRoutes from './src/routes/auth.js';
import { auth } from './src/middlewares/auth.js'

const { DOMAIN, PORT } = process.env;
const HOST = `${DOMAIN}:${PORT}`;


const app = express();


app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded( { extended: true } ));

app.use(express.static('./src/public'));


app.use('/api/users', userRoutes); 
app.use('/api/tasks', auth, taskRoutes);
app.use('/api/auth', authRoutes);


 app.listen(PORT);
    console.log('Server is active now');

 
(async function(){
try {
	await sequelize.authenticate();
	console.log('Connection has been established successfully.');
  
} catch (error) {
	console.error('Unable to connect to the database:', error);
}
})();
