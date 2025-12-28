import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';


const Session = sequelize.define('session', {
	refreshToken: {
		type: DataTypes.STRING,
		allowNull: false
	},
	expiresAt: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	userAgent: DataTypes.STRING,
    ip: DataTypes.STRING,
	userId: {
		type: DataTypes.INTEGER,
		allowNull: false
	}
});

export default Session;