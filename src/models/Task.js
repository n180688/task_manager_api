import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Task = sequelize.define('task', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	title: {
		type: DataTypes.STRING(255),
		allowNull: false, 
		validate: {
			notEmpty: {
				msg: "Title cannot be empty"
			},
			len: {
				args: [1, 255],
				msg: 'Title length must be between 1 and 255 characters'
			}
		}
	},
	content: {
		type: DataTypes.TEXT,
		allowNull: true
	},
    status: {
		type: DataTypes.ENUM('in_progress', 'done', 'expired'),
		allowNull: false, 
		defaultValue: 'in_progress' 
	},
	deadline: {
		type: DataTypes.DATE,
		allowNull: true, 
	},
	userId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	categoryId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	}
});


export default Task;