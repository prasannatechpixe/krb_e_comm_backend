const client = require("../db/client");
require("../middlewares/dbfunctions")();

exports.createCart = (req, res, next) => {
  const { product_id, quantity, token } = req.body;
  if (!product_id || !quantity || !token) {
    return res.status(400).json({ success: false, message: "Missing required fields", responsecode: 400, });
  } else {
    getUserProfileFromToken(token, async (err, foundUser) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
      } else if (foundUser) {
        try {
          const userId = foundUser.id;
          // Check if the item exists in the `Wishlists` table and delete it
          const deleteWishlistQuery = `DELETE FROM "Wishlists" WHERE "userId" = $1 AND "productId" = $2 RETURNING *`;
          const deleteWishlistValues = [userId, product_id];
          const wishlistResult = await client.query(deleteWishlistQuery, deleteWishlistValues);

          if (wishlistResult.rowCount > 0) {
            console.log("Moved to cart.");
          }
          const checkQuery = `SELECT * FROM "Carts" WHERE "userId" = $1 AND "productId" = $2`;
          const checkValues = [userId, product_id];
          const checkResult = await client.query(checkQuery, checkValues);
          if (checkResult.rowCount > 0) {
            const updateQuery = `UPDATE "Carts" SET quantity = quantity + $1 WHERE "userId" = $2 AND "productId" = $3 RETURNING *`;
            const updateValues = [Number(quantity), userId, product_id];
            client.query(updateQuery, updateValues, async (err, updatedCart) => {
              if (err) {
                return res.status(500).json({ success: false, message: err.message, data: err.data });
              } else if (updatedCart.rowCount === 1 && wishlistResult.rowCount === 0) {
                return res.status(200).json({ success: true, message: "Cart updated", data: updatedCart.rows, responsecode: 200 });
              } else if (updatedCart.rowCount === 1 && wishlistResult.rowCount > 0) {
                return res.status(201).json({ success: true, message: "Moved to cart", data: updatedCart.rows[0], responsecode: 201 });
              }
              else {
                return res.status(500).json({ success: true, message: 'unable to update cart', data: updatedCart.rows });
              }
            });
          } else {
            const insertQuery = `INSERT INTO "Carts" ( "productId", quantity, "userId") VALUES ($1, $2, $3) RETURNING *`;
            const insertValues = [product_id, Number(quantity), userId,];
            client.query(insertQuery, insertValues, async (err, insertedCart) => {
              if (err) {
                return res.status(500).json({ success: true, message: err.message, data: err.data });
              } else if (insertedCart && wishlistResult.rowCount === 0) {
                return res.status(201).json({ success: true, message: "Added to cart", data: insertedCart.rows[0], responsecode: 201 });
              } else if (insertedCart && wishlistResult.rowCount > 0) {
                return res.status(201).json({ success: true, message: "Moved to cart", data: insertedCart.rows[0], responsecode: 201 });
              }
              else {
                return res.status(422).json({ success: true, message: 'Product not added to cart', data: result.rows });
              }
            });
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


exports.getCarts = (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, message: "Missing access token", responsecode: 400 });
  } else {
    getUserProfileFromToken(token, async (err, foundUser) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
      }
      else if (!foundUser) {
        return res.status(401).json({ success: false, message: "User not found", responsecode: 401 });
      } else {
        try {
          const userId = foundUser.id;
          const query = `SELECT p.*, c.quantity, c.id as cart_id FROM "Products" p JOIN "Carts" c ON p.id = c."productId"::INTEGER WHERE c."userId" = $1 AND c."productId" ~ '^[0-9]+$';`;
          const values = [userId];

          client.query(query, values, (err, result) => {
            if (err) {
              return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
            }
            if (result.rowCount > 0) {
              return res.status(200).json({ success: true, cart: result.rows, responsecode: 200 });
            }
            return res.status(200).json({ success: true, cart: [], message: "No carts found", responsecode: 200 });
          });
        } catch (error) {
          return res.status(500).json({ success: false, message: error.message, responsecode: 500 });
        }
      }
    });
  }
};

exports.getCartById = (req, res) => {
  const cart_id = req.params.id;
  const { token } = req.body;
  if (!token || !cart_id) {
    return res.status(400).json({ success: false, message: "Missing Details", responsecode: 400 });
  }
  else {
    getUserProfileFromToken(token, async (err, foundUser) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
      } else if (foundUser) {
        try {
          const userId = foundUser.id;
          const query = `SELECT p.*, c.quantity, c.id as cart_id FROM "Products" p JOIN "Carts" c ON p.id = c."productId"::INTEGER WHERE c."userId" = $1 AND c.id = $2 AND c."productId" ~ '^[0-9]+$';`;
          const values = [userId, Number(cart_id)];
          client.query(query, values, (err, result) => {
            if (err) {
              console.error("Database Error:", err.message);
              return res.status(500).json({
                success: false, message: err.message, responsecode: 500,
              });
            } else if (result.rowCount === 1) {
              return res.status(200).json({
                success: true, cart: result.rows[0], responsecode: 200,
              });
            } else {
              return res.status(404).json({ success: false, message: "Cart not found", responsecode: 404 });
            }
          });
        } catch (error) {
          return res.status(500).json({ success: false, message: error.message, responsecode: 500 });
        }
      } else {
        return res.status(401).json({ success: false, message: "User not found", responsecode: 401 });
      }
    });
  }
};


exports.updateCart = (req, res) => {
  const product_id = req.params.id;
  const { quantity, token } = req.body;
  if (!quantity || !token || !product_id) {
    return res.status(400).json({ success: false, message: "Missing required fields", responsecode: 400 });
  } else {
    getUserProfileFromToken(token, async (err, foundUser) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
      } else if (foundUser) {
        try {
          const userId = foundUser.id;
          const query = `UPDATE "Carts" SET quantity = $1 WHERE id = $2 AND "userId" = $3 RETURNING *;`;
          const values = [Number(quantity), product_id, userId];
          client.query(query, values, (err, result) => {
            if (err) {
              return res.status(500).json({ success: false, message: err.message, responsecode: err.code });
            } else if (result.rowCount === 1) {
              return res.status(200).json({ success: true, message: "Cart quantity updated successfully", data: result.rows[0], responsecode: 200 });
            } else {
              console.log('Cart quantity updated successfully', result.rowCount);
              return res.status(404).json({ success: false, message: "Cart not found or unauthorized access", responsecode: 404 });
            }
          });
        } catch (error) {
          return res.status(500).json({ success: false, message: error.message, responsecode: 500 }); Í
        }
      } else {
        return res.status(401).json({ success: false, message: "User not found or unauthorized", responsecode: 401 });
      }
    });
  }
};


exports.deleteCart = (req, res) => {
  const product_id = req.params.id;
  const { token } = req.body;
  if (!token || !product_id) {
    return res.status(400).json({ success: false, message: "Missing required fields", responsecode: 400 });
  } else {
    getUserProfileFromToken(token, async (err, foundUser) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
      } else if (foundUser) {
        try {
          const userId = foundUser.id;
          const query = `DELETE FROM public."Carts" where id = $1 and "userId" = $2`;
          const values = [Number(product_id), userId];
          client.query(query, values, (err, result) => {
            if (err) {
              return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
            } else if (result.rowCount === 0) {
              return res.status(404).json({ success: false, message: "Cart item not found", responsecode: 404 });
            } else {
              return res.status(200).json({ success: true, message: "Removed", responsecode: 200 });
            }
          });
        } catch (error) {
          return res.status(500).json({ success: false, message: error.message, responsecode: 500 });
        }
      } else {
        return res.status(401).json({ success: false, message: "User not found or unauthorized", responsecode: 401 });
      }
    });
  };
};