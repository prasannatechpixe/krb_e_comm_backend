const { tryEach } = require("async");
const client = require("../db/client");
require("../middlewares/dbfunctions")();

// For Admin dashboard
exports.createBrand = (req, res) => {
    const { brand_name, category_name, token } = req.body;
    if (!token) {
        return res.status(400).json({ success: false, message: "Missing required fields", responsecode: 400 });
    } else {
        getUserProfileFromToken(token, async (err, foundUser) => {
            if (err) {
                return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
            } else if (foundUser) {
                try {
                    const role = foundUser.role;
                    if (role === "admin") {
                        if (brand_name) {
                            const checkQuery = `INSERT INTO public."Brands"(brand_name) VALUES ($1);`;
                            const checkValues = [brand_name];
                            client.query(checkQuery, checkValues, async (err, result) => {
                                if (err) {
                                    return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
                                } else if (result.rowCount === 1) {
                                    return res.status(201).json({ success: true, message: "Added", responsecode: 201 });
                                } else {
                                    return res.status(409).json({ success: false, message: "Unable to Add", responsecode: 409 });
                                }
                            });
                        } else if (category_name) {
                            const checkQuery = `INSERT INTO public."Categories"( "Category_name") VALUES ($1);`;
                            const checkValues = [category_name];
                            client.query(checkQuery, checkValues, async (err, result) => {
                                if (err) {
                                    return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
                                } else if (result.rowCount === 1) {
                                    return res.status(201).json({ success: true, message: "Added", responsecode: 201 });
                                } else {
                                    return res.status(409).json({ success: false, message: "Unable to add", responsecode: 409 });
                                }
                            });
                        } else {
                            return res.status(400).json({ success: false, message: "Something went wrong", responsecode: 400 });
                        }

                    } else {
                        return res.status(403).json({ success: false, message: "Unauthorized to perform this action", responsecode: 403 });
                    }
                } catch (error) {
                    return res.status(500).json({ success: false, message: error.message, responsecode: 500 });
                }
            } else {
                return res.status(401).json({ success: false, message: "User not found or unauthorized", responsecode: 401 });
            }
        });
    }
};

//For Admin Dashboard
exports.getBrandsOrcategories = (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ success: false, message: "Missing required fields", responsecode: 400 });
    } else {
        getUserProfileFromToken(token, async (err, foundUser) => {
            if (err) {
                return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
            } else if (foundUser) {
                try {
                    const role = foundUser.role;
                    if (role === "admin") {
                        const checkQuery = `select id,"Category_name" from "Categories";`;
                        const checkValues = [];
                        client.query(checkQuery, checkValues, async (err, categories) => {
                            if (err) {
                                return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
                            } else if (categories.rowCount > 0) {
                                const checkQuery = `select id,brand_name from "Brands";`;
                                const checkValues = [];
                                client.query(checkQuery, checkValues, async (err, brands) => {
                                    if (err) {
                                        return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
                                    } else if (brands.rowCount > 0) {
                                        return res.status(201).json({ success: true, categories: categories.rows, brands: brands.rows, responsecode: 200 });
                                    } else {
                                        return res.status(409).json({ success: false, message: "Unable to fetch", responsecode: 409 });
                                    }
                                });
                            } else {
                                return res.status(409).json({ success: false, message: "Unable to fetch", responsecode: 409 });
                            }
                        });

                    } else {
                        return res.status(403).json({ success: false, message: "Unauthorized to perform this action", responsecode: 403 });
                    }
                } catch (error) {
                    return res.status(500).json({ success: false, message: error.message, responsecode: 500 });
                }
            } else {
                return res.status(401).json({ success: false, message: "User not found or unauthorized", responsecode: 401 });
            }
        });
    }
};


//For Site landing page
exports.brandsWithProducts = async (req, res, next) => {
    try {
        // Query to fetch brands and their products
        const query = `SELECT b.brand_name, p."brandId",p.id AS productId,p.name AS productName FROM "Brands" b INNER JOIN "Products" p ON b.id = p."brandId"::integer where p."isPublished" = true ORDER BY b.id;`;

        const result = await client.query(query);

        if (result.rowCount < 1) {
            return res.status(404).json({ success: false, message: "No brands or products found", responsecode: 1 });
        }
        const brandsWithProducts = result.rows.reduce((acc, row) => {
            const name = "brand_name"; // Example prefix
            const key = `${name}:${row.brand_name}`;

            // Initialize the key if it doesn't exist
            acc[key] = acc[key] || [];

            // Exclude both brand_name and brandId
            const { brand_name, brandId, ...productDetails } = row;
            acc[key].push(productDetails);

            return acc;
        }, {});

        return res.status(200).json({ success: true, data: brandsWithProducts, responsecode: 2 });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message, responsecode: 1 });
    }
};

exports.categoriesWithProducts = async (req, res, next) => {
    try {
        // Query to fetch categories and their products
        const query = `SELECT c."Category_name",c.id as category_id,p.name as productName,p.id as productId FROM "Categories" c INNER JOIN "Products" p ON c.id = p."categoryId"::integer where p."isPublished" = true ORDER BY c."Category_name",p.id;`;
        const result = await client.query(query);
        if (result.rowCount < 1) {
            return res.status(404).json({ success: false, message: "No categories or products found", responsecode: 1 });
        }
        // Group products under their respective categories
        const categoriesWithProducts = result.rows.reduce((acc, row) => {
            const name = "category_name"; // Example prefix
            const key = `${name}:${row.Category_name}`;

            // Initialize the key if it doesn't exist
            acc[key] = acc[key] || [];

            // Exclude both brand_name and brandId
            const { Category_name, category_id, ...productDetails } = row;
            acc[key].push(productDetails);

            return acc;
        }, {});

        return res.status(200).json({ success: true, data: categoriesWithProducts, responsecode: 2, });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message, responsecode: 1, });
    }
};