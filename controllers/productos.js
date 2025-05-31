const mongoDb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

// Validación opcional
function validateProductData(data) {
    const { name_product, price_product, stock_product } = data;
    return (
        typeof name_product === "string" &&
        name_product.trim() !== "" &&
        typeof price_product === "number" &&
        price_product >= 0 &&
        typeof stock_product === "number" &&
        stock_product >= 0
    );
}

const getAll = async (req, res) => {
    try {
        const result = await mongoDb.getDatabase().db().collection("productos").find();
        result.toArray().then((productos) => {
            res.setHeader("Content-Type", "application/json");
            res.status(200).json(productos);
        });
    } catch (error) {
        res.status(500).json({ error: "Error retrieving products." });
    }
};

const getSingle = async (req, res) => {
    try {
        const productId = new ObjectId(req.params.id);
        const result = await mongoDb.getDatabase().db().collection("productos").find({ _id: productId });
        result.toArray().then((productos) => {
            res.setHeader("Content-Type", "application/json");
            res.status(200).json(productos[0]);
        });
    } catch (error) {
        res.status(500).json({ error: "Error retrieving the product." });
    }
};

const createUser = async (req, res) => {
    const product = {
        name_product: req.body.name_product,
        price_product: req.body.price_product,
        stock_product: req.body.stock_product
    };

    if (!validateProductData(product)) {
        return res.status(400).json({ error: "Invalid product data." });
    }

    try {
        const response = await mongoDb.getDatabase().db().collection("productos").insertOne(product);
        if (response.acknowledged) {
            res.status(201).json({ message: "Product created successfully." });
        } else {
            res.status(500).json({ error: "Failed to create product." });
        }
    } catch (error) {
        res.status(500).json({ error: "Error creating the product." });
    }
};

const updateUser = async (req, res) => {
    const productId = new ObjectId(req.params.id);
    const product = {
        name_product: req.body.name_product,
        price_product: req.body.price_product,
        stock_product: req.body.stock_product
    };

    if (!validateProductData(product)) {
        return res.status(400).json({ error: "Invalid product data." });
    }

    try {
        const response = await mongoDb.getDatabase().db().collection("productos").replaceOne({ _id: productId }, product);
        if (response.modifiedCount > 0) {
            res.status(200).json({ message: "Product updated successfully." });
        } else {
            res.status(500).json({ error: "Failed to update product." });
        }
    } catch (error) {
        res.status(500).json({ error: "Error updating the product." });
    }
};

const deleteUser = async (req, res) => {
    const productId = new ObjectId(req.params.id);
    try {
        const response = await mongoDb.getDatabase().db().collection("productos").deleteOne({ _id: productId });
        if (response.deletedCount > 0) {
            res.status(200).json({ message: "Product deleted successfully." });
        } else {
            res.status(500).json({ error: "Failed to delete product." });
        }
    } catch (error) {
        res.status(500).json({ error: "Error deleting the product." });
    }
};

module.exports = {
    getAll,
    getSingle,
    createUser,
    updateUser,
    deleteUser
};
