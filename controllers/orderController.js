const client = require('../db/client');
require('../middlewares/functions')();

// Get all Orders
exports.getOrders = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, message: "Missing token", responsecode: 400 });
  } else {
    getUserProfileFromToken(token, async (err, foundUser) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
      } else if (foundUser) {
        try {
          const userId = foundUser.id;
          const query = `SELECT o.*, p.name AS product_name, p.description AS product_description, p.price_in_usd AS price_in_usd,P.price_in_inr AS price_in_inr, p.images AS product_image FROM "Orders" o JOIN "Products" p ON o."productId" = p.id::text WHERE o."userId" = $1`;
          const values = [userId];

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

// Delete a Order by ID
exports.deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
