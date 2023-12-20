const Category = require("../../models/category/index");

const createCategory = async (req, res) => {
  const { category } = req.body;

  try {
    // Check if the category already exists
    const existingCategory = await Category.findOne({ categories: category });

    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }

    // Create a new category
    const newCategory = new Category({ categories: category });
    const savedCategory = await newCategory.save();

    res.status(201).json({
      category: savedCategory,
      status: "Category created successfully",
    });
  } catch (error) {
    console.error("Error creating category:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// All blog
const categoryList = async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    const categories = await Category.find({});

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCategory,
  categoryList,
};
