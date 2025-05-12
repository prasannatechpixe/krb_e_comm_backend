const client = require('../db/client');
require('../middlewares/functions')();

// Get all Orders
exports.getOrders = async (req, res) => {
    const { token, page, limit } = req.body;
    if (!token || !page || !limit) {
        return res.status(400).json({ success: false, message: "Missing token", responsecode: 400 });
    } else {
        getUserProfileFromToken(token, async (err, foundUser) => {
            if (err) {
                return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
            } else if (foundUser) {
                try {
                    const offset = (page - 1) * limit;
                    const role = foundUser.role;
                    if (role === "admin") {
                        const query = `SELECT o.*, p.name AS product_name, p.description AS product_description, p.price_in_usd AS price_in_usd,P.price_in_inr AS price_in_inr, p.images AS product_image FROM "Orders" o JOIN "Products" p ON o."productId" = p.id::text  LIMIT $1 OFFSET $2`;
                        const values = [limit, offset];
                        client.query(query, values, (err, result) => {
                            if (err) {
                                return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
                            }
                            if (result.rows.length > 0) {
                                return res.status(200).json({ success: true, data: result.rows, responsecode: 200 });
                            } else {
                                return res.status(200).json({ success: true, message: "No Orders Found", data: [], responsecode: 200 });
                            }
                        });

                    } else {

                    }
                } catch (error) {
                    return res.status(500).json({ success: false, message: error.message, responsecode: 500 });
                }
            } else {
                return res.status(401).json({ success: false, message: "User not found", responsecode: 401 });
            }
        });
    };
};

// Get a single Order by ID 
exports.getOrderById = async (req, res) => {
    const { token } = req.body;
    const { id } = req.params;
    if (!token) {
        return res.status(400).json({ success: false, message: "Missing details", responsecode: 400 });
    } else {
        getUserProfileFromToken(token, async (err, foundUser) => {
            if (err) {
                return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
            } else if (foundUser) {
                try {
                    const userId = foundUser.id;
                    const query = `SELECT o.id as orderId,o.*, p.*,p.id as productId FROM "Orders" o JOIN "Products" p ON o."productId" = p.id::text WHERE o.id = $1::integer`;
                    const values = [id];
                    client.query(query, values, (err, result) => {
                        if (err) {
                            return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
                        }
                        if (result.rows.length > 0) {
                            return res.status(200).json({ success: true, data: result.rows, responsecode: 200 });
                        } else {
                            return res.status(200).json({ success: true, message: "No Orders Found", data: result.rows, responsecode: 200 });
                        }
                    });
                } catch (error) {
                    return res.status(500).json({ success: false, message: error.message, responsecode: 500 });
                }
            } else {
                return res.status(401).json({ success: false, message: "User not found", responsecode: 401 });
            }
        });
    };
};


// Update Order or Cancel Order
exports.UpdateOrder = async (req, res) => {
    const { token } = req.body;
    const { id } = req.params;
    if (!token) {
        return res.status(400).json({ success: false, message: "Missing details", responsecode: 400 });
    } else {
        getUserProfileFromToken(token, async (err, foundUser) => {
            if (err) {
                return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
            } else if (foundUser) {
                try {
                    const userId = foundUser.id;
                    const query = `SELECT o.*, p.* FROM "Orders" o JOIN "Products" p ON o."productId" = p.id::text WHERE o."userId" = $1 and o.id = $2::integer`;
                    const values = [userId, id];
                    client.query(query, values, (err, result) => {
                        if (err) {
                            return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
                        }
                        if (result.rows.length > 0) {
                            return res.status(200).json({ success: true, data: result.rows, responsecode: 200 });
                        } else {
                            return res.status(200).json({ success: true, message: "No Orders Found", data: result.rows, responsecode: 200 });
                        }
                    });
                } catch (error) {
                    return res.status(500).json({ success: false, message: error.message, responsecode: 500 });
                }
            } else {
                return res.status(401).json({ success: false, message: "User not found", responsecode: 401 });
            }
        });
    };
};