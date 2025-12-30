import { Sequelize } from "sequelize";
const { DBUSER, DBPASS, DBNAME, DBHOST, DBPORT } = process.env;


const sequelize = new Sequelize(DBNAME, DBUSER, DBPASS, {
	host: DBHOST,
	port: DBPORT,
	dialect: 'postgres',

	logging: (msg) => {
		console.log('my', msg)
	}
});

export default sequelize;