import  Category  from "../models/Category.js";

async function checkCategoryOwner(req, res, next){
    const category = await Category.findOne({
        where: {
            id: req.params.id || req.body.categoryId,
            userId: req.user.id
        }
    });

    if(!category) {
        return res.status(404).json({ message: 'Category not found' })
    };

    req.category = category;

    next();

}

export { checkCategoryOwner }

