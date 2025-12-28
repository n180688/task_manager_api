import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Task = sequelize.define('task', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	title: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	content: {
		type: DataTypes.TEXT,
		allowNull: true
	},
    status: {
		type: DataTypes.ENUM('pending', 'done', 'expired', 'deleted'),
		allowNull: false, 
		defaultValue: 'pending' 
	},
	deadline: {
		type: DataTypes.DATE,
		allowNull: true, 
	},
	userId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	}
});


export default Task;