import { Sequelize } from "sequelize";
const { DBUSER, DBPASS, DBNAME } = process.env;


const sequelize = new Sequelize(DBNAME, DBUSER, DBPASS, {
	dialect: 'postgres',
	dialectOptions: {
		
	},
	logging: (msg) => {
		console.log('my', msg)
	}
});

export default sequelize;