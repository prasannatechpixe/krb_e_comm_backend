// server.js content placeholder
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config({ path: ".env" });
const path = require('path');
const app = express();
require("./middlewares/functions")();
const cors = require("cors");
const YAML = require('yamljs');
const swaggerUI = require('swagger-ui-express');

// Database connection
const sequelize = require('./db/postgres');
const swaggerDocument = YAML.load(path.join(__dirname, "config.yaml"));


//Models
const Cart = require('./models/cartModel');
const Notification = require('./models/notificationModel');
const Order = require('./models/orderModel');
const payment = require('./models/paymentModel');
const Products = require('./models/productModel');
const User = require('./models/userModel');
const Wishlist = require('./models/wishlistModel');
const Brands = require('./models/brands');
const Categories = require('./models/categories');
const Address = require('./models/address');
const deviceInfo = require('./controllers/userController');

// Routes 
const cartRoutes = require('./routes/cartRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const brandRoutes = require('./routes/brandsAndCategories');
const addressRoutes = require('./routes/address');
const admincalls = require('./routes/admincalls');


// Load environment variables
dotenv.config();

//cors implement
app.use(
  cors({
    origin: "*",
    allowedHeaders: "*",
  })
);

// Serve images from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  // in local filesystem
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));  // in development mode
app.use("/api-docs", swaggerUI.serveFiles(swaggerDocument), swaggerUI.setup(swaggerDocument));
app.use("/config.yaml", express.static(path.join(__dirname, "config.yaml")));

app.use(function (req, res, next) {
  res.header("Access-Control-Expose-Headers", 'responseheader');
  var err = null;
  try {
    decodeURIComponent(req.path);
  } catch (e) {
    err = e;
  }
  if (err) {
    console.error(err.message);
    console.error(req.url);
    let _res = ({ success: false, message: err.message, responsecode: 0 });
    res.setHeader("responseheader", encryptresponse(_res));
    res.send(_res);
  } else {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "websocket,GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Credentials", false);
    next();
  }
});

// Request process-time 
const measureRequestDuration = (req, res, next) => {
  const start = Date.now();
  res.once('finish', () => {
    const duration = Date.now() - start;
    console.log("Device " + getdeviceinfo(req));
    console.log("Time taken to process " + req.originalUrl + " is: " + duration + " ms ");
  });
  next();
};


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(measureRequestDuration);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err)
  res.status(500).json({ error: 'Something went wrong!' })
})


// Routes
app.use('/cart', cartRoutes);
app.use('/notifications', notificationRoutes);
app.use('/orders', orderRoutes);
app.use('/payments', paymentRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/brands', brandRoutes);
app.use('/address', addressRoutes);
app.use('/admincalls', admincalls);


// Test Database Connection
(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
})();

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'The route you are trying to access does not exist.',
    attemptedRoute: req.originalUrl, // User's attempted route
    method: req.method,             // HTTP method used
    responsecode: 404,
  });
  next();
});

// ==== SERVER START ====
const PORT = process.env.SERVER_PORT || 3000;
const server = app.listen(PORT, '127.0.0.1', (err) => {
    if (err) {
        console.error(err.message);
        return;
    }
    //localhost : 
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`API Docs: http://localhost:${PORT}/api-docs`);

    //production : 
    console.log(`Server running at https://camcapture.smartaihr.com/`);
    console.log(`API Docs: https://camcapture.smartaihr.com/api-docs`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  console.error(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  server.close(() => process.exit(1));
});
