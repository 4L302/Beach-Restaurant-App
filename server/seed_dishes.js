const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    }
    console.log('Connected to the SQLite database for seeding.');
});

const dishes = [
    {
        name: 'Steak Frites',
        description: 'Classic juicy steak served with crispy golden fries and a side of béarnaise sauce.',
        price: 25.99,
        category: 'meat',
        image_url: 'https://images.unsplash.com/photo-1546964124-6cce460f09ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3RlYWslMjBmcnl0ZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
        ingredients: 'Beef sirloin, potatoes, butter, salt, pepper, béarnaise sauce (eggs, butter, vinegar, tarragon)',
        preparation: 'Steak grilled to perfection, potatoes double-fried for extra crispiness.',
        allergens: 'Eggs, Dairy (butter in béarnaise)'
    },
    {
        name: 'Grilled Salmon',
        description: 'Healthy and delicious grilled salmon fillet seasoned with lemon and herbs, served with asparagus.',
        price: 22.50,
        category: 'fish',
        image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z3JpbGxlZCUyMHNhbG1vbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
        ingredients: 'Salmon fillet, lemon, dill, olive oil, asparagus, salt, pepper',
        preparation: 'Salmon grilled over medium heat until flaky, asparagus blanched and lightly grilled.',
        allergens: 'Fish'
    },
    {
        name: 'Spaghetti Carbonara',
        description: 'A classic Roman pasta dish with eggs, Pecorino Romano cheese, guanciale, and black pepper.',
        price: 18.00,
        category: 'meat',
        ingredients: 'Spaghetti, eggs, Pecorino Romano cheese, guanciale (cured pork cheek), black pepper',
        preparation: 'Pasta cooked al dente, mixed with a creamy sauce of eggs and cheese, and crispy guanciale.',
        allergens: 'Eggs, Dairy (cheese), Gluten (pasta)',
        image_url: 'https://images.unsplash.com/photo-1588013273468-31508b24234d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3BhZ2hldHRpJTIwY2FyYm9uYXJhfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    },
    {
        name: 'Seafood Paella',
        description: 'Traditional Spanish rice dish loaded with shrimp, mussels, clams, and calamari, simmered in a saffron-infused broth.',
        price: 28.75,
        category: 'fish',
        ingredients: 'Bomba rice, shrimp, mussels, clams, calamari, saffron, tomatoes, bell peppers, peas, garlic, olive oil',
        preparation: 'Rice and seafood simmered slowly in a large paella pan with broth and seasonings.',
        allergens: 'Shellfish (shrimp, mussels, clams), Fish (calamari)',
        image_url: 'https://images.unsplash.com/photo-1511910849014-75953593a230?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2VhZm9vZCUyMHBhZWxsYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    }
];

db.serialize(() => {
    const stmt = db.prepare(`INSERT INTO dishes (name, description, price, category, image_url, ingredients, preparation, allergens)
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

    // Simple check to see if dishes table is empty, to prevent re-seeding on every verification.
    // This is a basic approach. A more robust seeder would have better versioning or checking.
    db.get("SELECT COUNT(*) as count FROM dishes", (err, row) => {
        if (err) {
            console.error("Error checking dish count:", err.message);
            return;
        }
        if (row.count === 0) {
            console.log("Dishes table is empty, proceeding with seeding...");
            dishes.forEach(dish => {
                stmt.run(dish.name, dish.description, dish.price, dish.category, dish.image_url, dish.ingredients, dish.preparation, dish.allergens, function(err) {
                    if (err) {
                        console.error(`Error inserting ${dish.name}:`, err.message);
                    } else {
                        console.log(`Inserted ${dish.name} successfully with ID ${this.lastID}.`);
                    }
                });
            });
        } else {
            console.log("Dishes table already has data. Seeding skipped.");
        }
        stmt.finalize((err) => {
            if (err) console.error("Error finalizing statement:", err.message);
            db.close((err) => {
                if (err) console.error(err.message);
                console.log('Closed the database connection after attempting to seed.');
            });
        });
    });
});
