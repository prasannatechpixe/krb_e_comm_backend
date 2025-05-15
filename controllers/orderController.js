const client = require('../db/client');
require('../middlewares/functions')();

exports.createOrder = async (req, res) => {
  const { token, cartId, items, addressId, paymentMethod } = req.body;

  if (!token || (!cartId && (!items || !items.length)) || !addressId || !paymentMethod) {
    return res.status(400).json({success: false, message: 'Missing required details', responsecode: 400, });
  }

  const validPaymentMethods = ['Credit Card', 'Debit Card', 'PayPal', 'UPI', 'Bank Transfer', 'Other'];
  if (!validPaymentMethods.includes(paymentMethod)) {
    return res.status(400).json({success: false,message: 'Invalid payment method',responsecode: 400,});
  }

  getUserProfileFromToken(token, async (err, foundUser) => {
    if (err) {
      return res.status(500).json({success: false,message: err.message, responsecode: 500,});
    }

    if (!foundUser) {
      return res.status(401).json({ success: false,message: 'User not found',responsecode: 401,});
    }

    const userId = foundUser.id;
    const userCountry = foundUser.country;

    try {
      let itemsToProcess = items;

      // If `cartId` is provided, fetch items from the cart
      if (cartId) {
        const cartResult = await client.query(
          `SELECT "productId", quantity FROM "Carts" WHERE id = $1 AND "userId" = $2`,
          [cartId, userId]
        );

        if (!cartResult.rows.length) {
          return res.status(404).json({success: false,message: 'Cart not found or empty', responsecode: 404,});
        }

        itemsToProcess = cartResult.rows;
      }

      // Fetch billing address details
      const addressResult = await client.query(
        `SELECT * FROM billing_addresses WHERE id = $1 AND "userId" = $2`,
        [addressId, userId]
      );
      const address = addressResult.rows[0];

      if (!address) {
        return res.status(404).json({success: false,message: 'Billing address not found',responsecode: 404,});
      }

      // Calculate total order amount
      let totalAmount = 0;
      const orderItems = [];
      const productIds = [];

      for (const item of itemsToProcess) {
        const { productId, quantity } = item;

        // Fetch product details
        const productResult = await client.query(`SELECT * FROM "Products" WHERE id = $1`, [productId]);
        const product = productResult.rows[0];

        if (!product || product.stock < quantity) {
          return res.status(400).json({success: false,message: `Product with ID ${productId} is unavailable or out of stock`,responsecode: 400,});
        }

      //   // Price selection based on country and also apply the discount
      //   let itemPrice = userCountry === 'India' ? product.price_in_inr : product.price_in_usd;
      //   let discount = product.discountPrice ;

      //   // Correct discount calculation with precision
      //   discountedPrice = itemPrice - (itemPrice * discount / 100);
      //   const itemTotal = Number((discountedPrice * quantity).toFixed(2));

      //   totalAmount += itemTotal;

      //   orderItems.push({
      //     productId: productId.toString(),
      //     quantity,
      //     price: discountedPrice,
      //     total: itemTotal,
      //   });

      //   productIds.push(productId.toString());
      // }


      // original price without using discount
      let itemPrice = userCountry === 'India' ? product.price_in_inr : product.price_in_usd;
      const itemTotal = itemPrice * quantity;

        totalAmount += itemTotal;

        orderItems.push({
          productId: productId.toString(),
          quantity,
          price: itemPrice,
          total: itemTotal,
        });

        productIds.push(productId.toString());
      }

      const productIdsString = productIds.join(',');

      const orderResult = await client.query(
        `INSERT INTO "Orders"
          ("userId", "productId", "totalAmount", "paymentStatus", "paymentMethod")
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [userId, productIdsString, totalAmount, 'Pending', paymentMethod]
      );

      const newOrder = orderResult.rows[0];
      const orderId = newOrder.id;

      // Update product stock
      for (const orderItem of orderItems) {
        const { productId, quantity } = orderItem;
        await client.query(
          `UPDATE "Products" SET stock = stock - $1 WHERE id = $2`,
          [quantity, productId]
        );
      }

      // Clear the cart if used
      if (cartId) {
        await client.query(`DELETE FROM "Carts" WHERE id = $1 AND "userId" = $2`, [cartId, userId]);
      }

      return res.status(201).json({
        success: true,
        message: `Order placed successfully with ID: ${orderId}`,
        order: {
          id: orderId,
          totalAmount: Number(totalAmount.toFixed(2)),
          items: orderItems,
          address: address,
          paymentMethod,
          status: 'Pending',
        },
        responsecode: 201,
      });
    } catch (error) {
      console.error('Error creating order:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create order',
        responsecode: 500,
      });
    }
  });
};


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
  const { id } = req.params;

  try {
    // Check if the order exists
    const checkQuery = `SELECT * FROM "Orders" WHERE id = $1`;
    const checkResult = await client.query(checkQuery, [id]);

    if (checkResult.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Delete the order
    const deleteQuery = `DELETE FROM "Orders" WHERE id = $1`;
    const deleteResult = await client.query(deleteQuery, [id]);

    if (deleteResult.rowCount === 1) {
      return res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to delete order' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
