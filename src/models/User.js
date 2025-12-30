import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';


const User = sequelize.define('user', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	login: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
		validate: {
			len: {
				args: [3, 50],
				msg: 'Login must be between 3 and 50 characters'
			},
			is: {
				args: /^(?!-)(?!.*--)(?!.*__)[a-zA-Z0-9_-]+(?<!-)$/,
				msg: 'Login contains invalid characters'
			}
		}
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false
	}
});

export default User;