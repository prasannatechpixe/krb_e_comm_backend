const Payment = require('../models/paymentModel');
const paypal = require('@paypal/checkout-server-sdk');
const client = require('../db/client');
const { default: axios } = require('axios');
const { ChangePassword } = require('./userController');


// Configure PayPal Environment
// const environment = new paypal.core.SandboxEnvironment(
//   process.env.PAYPAL_CLIENT_ID,
//   process.env.PAYPAL_CLIENT_SECRET
// );
// const client = new paypal.core.PayPalHttpClient(environment);

// getting access token form paypal.
const getPayPalAccessToken = async () => {
  try {
    const url = `${process.env.PAYPAL_REDIRECT_BASE_URL}/v1/oauth2/token`;
    const response = await axios.post(
      url,
      new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
          username: process.env.PAYPAL_CLIENT_ID,
          password: process.env.PAYPAL_CLIENT_SECRET,
        },
      }
    );
    return response.data.access_token; // Return the access token
  } catch (error) {
    if (error.response) {
      return error.response;
    } else {
      return error.message;
    }
  }
};

// Function to check PayPal order status
exports.checkOrderStatus = async (req, res) => {
  const { token, PaypalOrderId, productIds, paypal_response } = req.body;

  if (!token || !PaypalOrderId || !paypal_response) {
    return res.status(400).json({ success: false, message: "Provide all required parameters: token, PaypalOrderId, productIds, and paypal_response.", statuscode: 1, });
  }
  if (!Array.isArray(productIds) || !productIds.every(id => typeof id === "string")) {
    return res.status(400).json({
      success: false,
      message: "productIds must be an array of strings.",
      statuscode: 1
    });
  }
  else {
    getUserProfileFromToken(token, async (err, foundUser) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
      } else if (foundUser) {
        try {
          const userId = foundUser.id;
          // Get PayPal Access Token
          const paypalToken = await getPayPalAccessToken();
          // Define PayPal Order Details Endpoint
          const url = `${process.env.PAYPAL_REDIRECT_BASE_URL}/v2/checkout/orders/${PaypalOrderId}`;
          // Make API Request to PayPal
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${paypalToken}`,
            },
          });
          const orderDetails = response.data;
          const amount = orderDetails.purchase_units[0]?.amount?.value || '';
          const currency_code = orderDetails.purchase_units[0]?.amount?.currency_code || '';
          const orderStatus = orderDetails.status || '';
          // Check if order_id already exists
          const checkOrderQuery = `SELECT * FROM public."Payments" WHERE order_id = $1;`;
          const checkOrderValues = [PaypalOrderId];
          const existingOrderResult = await client.query(checkOrderQuery, checkOrderValues);
          if (existingOrderResult.rowCount === 1 && existingOrderResult.rows[0].paymentStatus != 'COMPLETED' && orderDetails.status === 'COMPLETED') {
            const query = `UPDATE public."Payments"	SET "paymentStatus"=$1, updated_at='NOW()', paypal_response=$2	WHERE order_id = $3 and user_id = $4`;
            const values = [orderStatus, paypal_response, PaypalOrderId, userId];
            client.query(query, values, async (err, paymentUpdate) => {
              if (err) {
                return res.status(500).json({ success: false, message: "Database error: " + err.message });
              } else if (paymentUpdate.rowCount === 1) {
                const orderQuery = `INSERT INTO public."Orders"(
                  "userId", "totalAmount", "paymentMethod", "productId", "paymentStatus") 
                  VALUES ($1, $2, $3, $4, $5);`;
                for (let productId of productIds) {
                  const orderValues = [userId, amount, "PayPal", productId, orderStatus];
                  await client.query(orderQuery, orderValues); // Await each query to ensure sequential execution
                }
                const productCount = productIds.length;
                return res.status(200).json({ success: true, message: `${productCount > 1 ? "Orders has been Placed" : "Order has been Placed"}.`, statuscode: 200, });
              } else {
                return res.status(500).json({ success: false, message: "Payment not Updated", statuscode: 500 });
              }
            });
          } else if (existingOrderResult.rowCount === 0 && orderDetails.status === 'COMPLETED') {
            const query = `INSERT INTO public."Payments"(
              user_id, order_id, payment_method, amount, currency_code, "paymentStatus", paypal_response)
              VALUES ($1, $2, $3, $4, $5, $6, $7);`;
            const values = [userId, PaypalOrderId, "PayPal", amount, currency_code, orderStatus, paypal_response];
            client.query(query, values, async (err, paymentUpdate) => {
              if (err) {
                return res.status(500).json({ success: false, message: "Database error: " + err.message });
              } else if (paymentUpdate.rowCount === 1) {
                const orderQuery = `INSERT INTO public."Orders"(
                  "userId", "totalAmount", "paymentMethod", "productId", "paymentStatus") 
                  VALUES ($1, $2, $3, $4, $5);`;
                // const orderValues = [userId, amount, "PayPal", productIds, orderStatus];
                for (let productId of productIds) {
                  const orderValues = [userId, amount, "PayPal", productId, orderStatus];
                  await client.query(orderQuery, orderValues); // Await each query to ensure sequential execution
                }
                const productCount = productIds.length;
                return res.status(200).json({ success: true, message: `${productCount > 1 ? "Orders has been Placed" : "Order has been Placed"}.`, statuscode: 200, });
              } else {
                return res.status(500).json({ success: false, message: "Payment not Updated", statuscode: 500 });
              }
            })
          } else if (existingOrderResult.rowCount === 0 && orderDetails.status !== 'COMPLETED') {
            const query = `INSERT INTO public."Payments"(
              user_id, order_id, payment_method, amount, currency_code, "paymentStatus", paypal_response)
              VALUES ($1, $2, $3, $4, $5, $6, $7);`;
            const values = [userId, PaypalOrderId, "PayPal", amount, currency_code, orderStatus, paypal_response];
            client.query(query, values, (err, paymentUpdate) => {
              if (err) {
                return res.status(500).json({ success: false, message: "Database error: " + err.message });
              } else if (paymentUpdate.rowCount === 1) {
                return res.status(400).json({ success: false, message: "Order status is not completed.", orderStatus });
              } else {
                return res.status(500).json({ success: false, message: "Payment not Updated", statuscode: 500 });
              }
            });
          } else if (existingOrderResult.rowCount === 1 && orderDetails.status !== 'COMPLETED') {
            return res.status(400).json({ success: false, message: `${orderStatus}`, orderStatus });
          } else if (existingOrderResult.rowCount === 1 && orderDetails.status === 'COMPLETED') {
            return res.status(400).json({ success: false, message: "Payment already processed", statuscode: 400 });
          } else {
            return res.status(500).json({ success: false, message: "Payment is Unable to Trace", statuscode: 500 });
          }
        } catch (paypalErr) {
          return res.status(500).json({ success: false, message: "PayPal API error: " + (paypalErr.response?.data?.message || paypalErr.message || "Unknown error") });
        }
      } else {
        return res.status(401).json({ message: "User not found.", responsecode: 401 });
      }
    });
  }
};
