const db = require('../database'); // Import the shared db instance
const { runQuery, getQuery, allQuery } = require('../utils/dbHelpers'); // Import helpers

// Controller functions
const createDish = async (req, res) => {
    const { name, description, price, category, image_url, ingredients, preparation, allergens } = req.body;

    if (!name || !price || !category) {
        return res.status(400).json({ message: 'Name, price, and category are required.' });
    }
    if (category !== 'meat' && category !== 'fish') {
        return res.status(400).json({ message: "Category must be 'meat' or 'fish'." });
    }

    const sql = `INSERT INTO dishes (name, description, price, category, image_url, ingredients, preparation, allergens)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    try {
        const result = await runQuery(db, sql, [name, description, price, category, image_url, ingredients, preparation, allergens]);
        const createdDish = await getQuery(db, 'SELECT * FROM dishes WHERE id = ?', [result.lastID]);
        res.status(201).json(createdDish);
    } catch (error) {
        console.error('Error creating dish:', error.message);
        res.status(500).json({ message: 'Server error creating dish.', error: error.message });
    }
};

const getDishes = async (req, res) => {
    const { category } = req.query;
    let sql = 'SELECT * FROM dishes';
    const params = [];

    if (category) {
        if (category !== 'meat' && category !== 'fish') {
            return res.status(400).json({ message: "Category query parameter must be 'meat' or 'fish'." });
        }
        sql += ' WHERE category = ?';
        params.push(category);
    }

    try {
        const dishes = await allQuery(db, sql, params);
        res.status(200).json(dishes);
    } catch (error) {
        console.error('Error fetching dishes:', error.message);
        res.status(500).json({ message: 'Server error fetching dishes.', error: error.message });
    }
};

const getDishById = async (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM dishes WHERE id = ?';
    try {
        const dish = await getQuery(db, sql, [id]);
        if (!dish) {
            return res.status(404).json({ message: 'Dish not found.' });
        }
        res.status(200).json(dish);
    } catch (error) {
        console.error('Error fetching dish by ID:', error.message);
        res.status(500).json({ message: 'Server error fetching dish.', error: error.message });
    }
};

const updateDish = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, image_url, ingredients, preparation, allergens } = req.body;

    if (name === undefined || price === undefined || category === undefined) {
        return res.status(400).json({ message: 'Name, price, and category are required for update and cannot be null/undefined.' });
    }
    if (name === null || price === null || category === null) {
        return res.status(400).json({ message: 'Name, price, and category cannot be null.' });
    }
    if (category !== 'meat' && category !== 'fish') {
        return res.status(400).json({ message: "Category must be 'meat' or 'fish'." });
    }

    try {
        const existingDish = await getQuery(db, 'SELECT * FROM dishes WHERE id = ?', [id]);
        if (!existingDish) {
            return res.status(404).json({ message: 'Dish not found to update.' });
        }

        const sql_update = `UPDATE dishes SET
                        name = ?, description = ?, price = ?, category = ?,
                        image_url = ?, ingredients = ?, preparation = ?, allergens = ?
                     WHERE id = ?`;
        await runQuery(db, sql_update, [
            name,
            description !== undefined ? description : existingDish.description,
            price,
            category,
            image_url !== undefined ? image_url : existingDish.image_url,
            ingredients !== undefined ? ingredients : existingDish.ingredients,
            preparation !== undefined ? preparation : existingDish.preparation,
            allergens !== undefined ? allergens : existingDish.allergens,
            id
        ]);
        const updatedDish = await getQuery(db, 'SELECT * FROM dishes WHERE id = ?', [id]);
        res.status(200).json(updatedDish);
    } catch (error) {
        console.error('Error updating dish:', error.message);
        res.status(500).json({ message: 'Server error updating dish.', error: error.message });
    }
};

const deleteDish = async (req, res) => {
    const { id } = req.params;

    try {
        const existingDish = await getQuery(db, 'SELECT * FROM dishes WHERE id = ?', [id]);
        if (!existingDish) {
            return res.status(404).json({ message: 'Dish not found to delete.' });
        }

        const sql_delete = 'DELETE FROM dishes WHERE id = ?';
        const result = await runQuery(db, sql_delete, [id]);

        if (result.changes === 0) {
            return res.status(404).json({ message: 'Dish not found, or no changes made.' });
        }
        res.status(200).json({ message: 'Dish deleted successfully.' });
    } catch (error) {
        console.error('Error deleting dish:', error.message);
        res.status(500).json({ message: 'Server error deleting dish.', error: error.message });
    }
};

module.exports = {
    createDish,
    getDishes,
    getDishById,
    updateDish,
    deleteDish
};
