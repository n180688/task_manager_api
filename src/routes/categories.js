import { Router } from "express";
import  Category  from "../models/Category.js";
import { checkCategoryOwner } from "../middlewares/checkCategoryOwner.js";
const router = Router();


router.get('/', async (req, res) => {
  const categories = await Category.findAll({
    where: { userId: req.user.id },
    order: [['isSystem', 'DESC'], ['name', 'ASC']]
  })

  res.json(categories)
})



router.post('/', async (req, res) => {
  try {
    const name = req.body.name?.trim()

    if (!name) {
      return res.status(400).json({ message: 'Category name required' })
    }

    const category = await Category.create({
      name,
      userId: req.user.id
    })

    res.status(201).json(category)
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Category with this name already exists' })
    }

    res.status(500).json({ message: 'Error creating category' })
  }
})



router.patch('/:id', checkCategoryOwner, async (req, res) => {
  const category = req.category

  if (category.isSystem) {
    return res.status(400).json({ message: 'System categories cannot be renamed' })
  }

  const name = req.body.name?.trim()
  if (!name) return res.status(400).json({ message: 'Name required' })

  category.name = name
  await category.save()

  res.json(category)
})



router.delete('/:id', checkCategoryOwner, async (req, res) => {
  const category = req.category

  if (category.isSystem) {
    return res.status(400).json({ message: 'System categories cannot be deleted' })
  }

  await category.destroy();
  res.json({ message: 'Category deleted' })
})


export default router;