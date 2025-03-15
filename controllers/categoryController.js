const db = require('../config/database');

// Get all movie categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await db.any('SELECT * FROM movies.category');
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching movie categories' });
  }
};

// Create a new movie category
exports.createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const category = await db.one(
      'INSERT INTO movies.category(name) VALUES($1) RETURNING *',
      [name]
    );
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while creating a movie category' });
  }
};

// Get movie category information by ID
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await db.oneOrNone('SELECT * FROM movies.category WHERE category_id = $1', [id]);
    if (!category) {
      return res.status(404).json({ message: 'Movie category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching movie category information' });
  }
};

// Update movie category information
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const category = await db.oneOrNone('SELECT * FROM movies.category WHERE category_id = $1', [id]);
    if (!category) {
      return res.status(404).json({ message: 'Movie category not found' });
    }
    const updatedCategory = await db.one(
      'UPDATE movies.category SET name = $1 WHERE category_id = $2 RETURNING *',
      [name, id]
    );
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating movie category' });
  }
};

// Delete a movie category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await db.oneOrNone('SELECT * FROM movies.category WHERE category_id = $1', [id]);
    if (!category) {
      return res.status(404).json({ message: 'Movie category not found' });
    }
    await db.none('DELETE FROM movies.category WHERE category_id = $1', [id]);
    res.status(204).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while deleting movie category' });
  }
};