import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Category = sequelize.define('category', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	name: {
		type: DataTypes.STRING(255),
		allowNull: false, 
		validate: {
			notEmpty: {
				msg: "Name cannot be empty"
			},
			len: {
				args: [1, 255],
				msg: 'Category name length must be between 1 and 255 characters'
			}
		}
	},
    isSystem: {
		type: DataTypes.BOOLEAN,
		allowNull: false, 
		defaultValue: false
	},
	userId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	}
}, {    indexes: [
        {
            unique: true,
            fields: ['userId', 'name']
        }
    ]}
);


export default Category;