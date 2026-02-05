import User from "./User.js";
import Task from "./Task.js";
import Session from "./Session.js";
import Category from "./Category.js";
import sequelize from "../config/db.js";

User.hasMany(Task, {foreignKey: 'userId'});
Task.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

User.hasMany(Session, {foreignKey: 'userId'});
Session.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

Category.belongsTo(User, { 
    foreignKey:'userId', 
    onDelete: 'CASCADE'
 });

User.hasMany(Category, { foreignKey: 'userId' });

Category.hasMany(Task, { foreignKey: 'categoryId' });

Task.belongsTo(Category, { foreignKey: 'categoryId' });

export { User, Task, Session, Category };

// (async function(){
//    await sequelize.sync({alter: true});
//   console.log('DB synced');
// //     //сидка users:
// //     const users = await User.bulkCreate([
// //     { login: "admin", password: "admin" },
// //    { login: "bob", password: "123" }
// //  ]);

// })();