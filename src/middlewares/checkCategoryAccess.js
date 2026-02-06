import  Category  from "../models/Category.js";

async function checkCategoryAccess(req, res, next){

    const { categoryId } = req.body;

    if (categoryId === undefined) {
        return next()
    }

    const category = await Category.findOne({
        where: {
            id: categoryId,
            userId: req.user.id
        }
    });

    if(!category) {
        return res.status(400).json({ message: 'Invalid category' })
    };

    next();

}

export { checkCategoryAccess };

