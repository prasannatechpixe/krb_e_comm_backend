const client = require('../db/client');

// Create a new Wishlist
exports.createWishlist = (req, res) => {
  const { product_id, token } = req.body;
  if (!product_id || !token) {
    return res.status(400).json({ success: false, message: "Missing required fields", responsecode: 400 });
  } else {
    getUserProfileFromToken(token, async (err, foundUser) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
      } else if (foundUser) {
        try {
          const userId = foundUser.id;
          const checkQuery = `SELECT * FROM "Wishlists" WHERE "userId" = $1 AND "productId" = $2`;
          const checkValues = [userId, product_id];
          console.log("debug1",);
          client.query(checkQuery, checkValues, async (err, result) => {
            if (err) {
              return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
            } else if (result.rowCount === 0) {
              const insertQuery = `INSERT INTO "Wishlists" ("userId", "productId") VALUES ($1, $2) RETURNING *`;
              const insertValues = [userId, product_id];
              client.query(insertQuery, insertValues, (err, added) => {
                if (err) {
                  return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
                } else {
                  return res.status(201).json({ success: true, message: "Added to wishlist", data: added.rows[0], responsecode: 201 });
                }
              });
            } else {
              return res.status(409).json({ success: false, message: "Item already in wishlist", responsecode: 409 });
            }
          });
        } catch (error) {
          return res.status(500).json({ success: false, message: error.message, responsecode: 500 });
        }
      } else {
        return res.status(401).json({ success: false, message: "User not found or unauthorized", responsecode: 401 });
      }
    });
  }
};

// Get all Wishlists
exports.getWishlist = (req, res) => {
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
          const query = `SELECT p.*, p.id as product_id, c.id FROM "Products" p JOIN "Wishlists" c ON p.id = c."productId"::INTEGER WHERE c."userId" = $1 AND c."productId" ~ '^[0-9]+$';`;
          const values = [userId];

          client.query(query, values, (err, result) => {
            if (err) {
              return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
            }
            if (result.rows.length > 0) {
              return res.status(200).json({ success: true, data: result.rows, responsecode: 200 });
            } else {
              return res.status(200).json({ success: true, message: "No items in wishlist", data: [], responsecode: 200 });
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


// Get a single Wishlist by ID
exports.getWishlistById = (req, res) => {
  const wishlist_id = req.params.id;
  const { token } = req.body;
  if (!wishlist_id || !token) {
    return res.status(400).json({ success: false, message: "Missing required fields", responsecode: 400 });
  } else {
    getUserProfileFromToken(token, (err, foundUser) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
      } else if (foundUser) {
        const userId = foundUser.id;
        const query = `SELECT p.*, c.id FROM "Products" p JOIN "Wishlists" c ON p.id = c."productId"::INTEGER WHERE c."userId" = $1 and c.id = $2 AND c."productId" ~ '^[0-9]+$';`;
        const values = [userId, wishlist_id];
        client.query(query, values, (err, result) => {
          if (err) {
            return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
          }
          if (result.rows.length > 0) {
            return res.status(200).json({ success: true, data: result.rows[0], responsecode: 200 });
          } else {
            return res.status(404).json({ success: false, message: "Wishlist item not found", responsecode: 404 });
          }
        });
      } else {
        return res.status(404).json({ success: false, message: "User Not Found", responsecode: 404 });
      }
    });
  };
};


// Delete a Wishlist by ID
exports.deleteWishlist = (req, res) => {
  const product_id = req.params.id;
  const { token } = req.body;
  if (!product_id || !token) {
    return res.status(400).json({ success: false, message: "Missing required fields", responsecode: 400 });
  } else {
    getUserProfileFromToken(token, async (err, foundUser) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
      } else if (foundUser) {
        try {
          const userId = foundUser.id;
          const query = `DELETE FROM "Wishlists" WHERE id = $1 AND "userId" = $2 RETURNING *;`;
          const values = [product_id, userId];

          client.query(query, values, (err, result) => {
            if (err) {
              return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
            } else if (result.rowCount === 0) {
              return res.status(404).json({ success: false, message: "Not found", responsecode: 404 });
            } else {
              return res.status(200).json({ success: true, message: "deleted", responsecode: 200 });
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

