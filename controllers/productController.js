const client = require('../db/client');
const os = require('os');
const path = require('path');
const fs = require('fs');
require("../middlewares/functions")();
const SftpClient = require('ssh2-sftp-client');
const { ident } = require('pg-format');
const sftp = new SftpClient();

const networkInterfaces = os.networkInterfaces();
const en0 = networkInterfaces['en0'] || [];

const serverIp = en0.find((iface) => iface.family === 'IPv4')?.address || '127.0.0.1';
// const domain = '147.79.71.46'; // Example: 'api.yourdomain.com'
// const domain = 'localhost';

// Define upload directory based on environment
const domain = process.env.NODE_ENV === 'production' ? 'camcapture.smartaihr.com' : 'localhost:3000';



exports.getAllProducts = async (req, res) => {
  const { page, limit, showIn, token } = req.body;
  const offset = (page - 1) * limit;
  if (!page || !limit || !showIn) {
    return res.status(400).json({ success: false, message: "Missing Fields", responsecode: 400 });
  } else {
    if (token) {
      getUserProfileFromToken(token, async (err, foundUser) => {
        if (err) {
          return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
        } else if (foundUser.role === 'admin') {
          const query = `
          SELECT id, name, price_in_usd, price_in_inr, description, images
          FROM public."Products" 
          WHERE "isPublished" = true 
          ORDER BY id 
          LIMIT $1 
          OFFSET $2`;
          const values = [limit, offset];
          client.query(query, values, async (err, productsData) => {
            if (err) {
              return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
            }
            else {
              const countQuery = 'SELECT COUNT(*) FROM "Products"';
              const totalCountResult = await client.query(countQuery);
              const totalCount = parseInt(totalCountResult.rows[0].count, 10);
              const totalPages = Math.ceil(totalCount / limit);
              return res.status(200).json({ success: true, data: productsData.rows, pagination: { currentPage: page, totalPages, totalCount, pageSize: limit }, responsecode: 200, });
            }
          });
        } else {
          return res.status(403).json({ success: false, message: "Unauthorized access", responsecode: 403 });
        }
      });
    } else {
      try {
        const query1 = `
          SELECT id, name, price_in_usd, price_in_inr, description, images
          FROM public."Products" 
          WHERE "isPublished" = true AND "showIn" @> $1::jsonb
          ORDER BY "createdAt" 
          LIMIT $2 
          OFFSET $3`;

        const query2 = `
          SELECT id, name, price_in_usd, price_in_inr, description, images
          FROM public."Products" 
          WHERE "isPublished" = true 
          ORDER BY "createdAt" 
          LIMIT $1 
          OFFSET $2`;

        const finalQuery = showIn === 'All' ? query2 : query1; // Use query2 for ALL
        let finalValues;

        if (showIn === 'All') {
          finalValues = [limit, offset];
        } else {
          finalValues = [`["${showIn}"]`, limit, offset]; // Correctly format showIn
        }

        const productsData = await client.query(finalQuery, finalValues);

        const countQuery = 'SELECT COUNT(*) FROM "Products"';
        const totalCountResult = await client.query(countQuery);
        const totalCount = parseInt(totalCountResult.rows[0].count, 10);

        if (productsData.rowCount === 0) {
          return res.status(404).json({ success: false, message: "No products found", responsecode: 404 });
        }

        const totalPages = Math.ceil(totalCount / limit);
        return res.status(200).json({ success: true, data: productsData.rows, pagination: { currentPage: page, totalPages, totalCount, pageSize: limit }, responsecode: 200, });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message, responsecode: 500 });
      }
    }
  }
};

// Get a product by ID (Anyone)
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  const { token } = req.body;
  if (!id) {
    return res.status(400).json({ success: false, message: "Product ID is required", responsecode: 400 });
  }
  if (token) {
    getUserProfileFromToken(token, async (err, foundUser) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
      } else if (foundUser) {
        try {
          const userId = foundUser.id;
          // const query = `SELECT p.*, COALESCE(c.quantity, 0) AS quantity,c.id AS cart_id FROM "Products" p LEFT JOIN "Carts" c ON p.id = c."productId"::INTEGER  AND c."userId" = $1 WHERE p.id = $2 AND p."isPublished" = true;`;
          const query = `SELECT p.*, COALESCE(c.quantity, 0) AS quantity, c.id AS cart_id,b.brand_name,cat."Category_name" FROM "Products" p LEFT JOIN "Carts" c ON p.id = c."productId"::INTEGER AND c."userId" = $1 LEFT JOIN "Brands" b ON p."brandId"::INTEGER = b.id LEFT JOIN "Categories" cat ON p."categoryId"::INTEGER = cat.id WHERE p.id = $2;`
          const values = [userId, Number(id)];
          client.query(query, values, (err, result) => {
            if (err) {
              return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
            } else if (result.rowCount === 1) {
              return res.status(200).json({ success: true, data: result.rows[0], responsecode: 200 });
            } else {
              return res.status(404).json({ success: false, message: "Product not found", responsecode: 404 });
            }
          });
        } catch (error) {
          return res.status(500).json({ success: false, message: error.message, responsecode: 500 });
        }
      } else {
        return res.status(401).json({ success: false, message: "User not found", responsecode: 401 });
      }
    });
  } else {
    try {
      const query = `SELECT p.*, b.brand_name, cat."Category_name" FROM "Products" p LEFT JOIN "Brands" b ON p."brandId"::INTEGER = b.id LEFT JOIN "Categories" cat ON p."categoryId"::INTEGER = cat.id WHERE p.id = $1;`;
      const values = [id];
      const productsData = await client.query(query, values);
      if (productsData.rowCount === 0) {
        return res.status(404).json({ success: false, message: "No products found", responsecode: 404 });
      } else if (productsData.rows[0].isPublished) {
        return res.status(200).json({ success: true, data: productsData.rows, responsecode: 200 });
      } else {
        return res.status(403).json({ success: false, message: "Products are not published yet", responsecode: 403 });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message, responsecode: 500 });
    }

  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  const {
    name,
    description,
    price_in_usd,
    price_in_inr,
    discountPrice,
    stock,
    categoryId,
    brandId,
    rating,
    showIn,
    tags,
    specifications,
    isPublished,
    Availability,
    youtubeLinks,
    manual,
    product_details,
    features,
    token,
    useCase,
  } = req.body;

  // Helper function to validate JSON
  const parseJSON = (data, fallback = null) => {
    try {
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch (error) {
      return fallback;
    }
  };

  // Validate required fields
  if (
    !name ||
    !description ||
    isNull(discountPrice) ||
    isNull(stock) ||
    !categoryId ||
    !brandId ||
    isNull(rating) ||
    !tags ||
    !token ||
    !showIn ||
    isNull(price_in_inr) ||
    isNull(price_in_usd) ||
    isNull(isPublished) ||
    isNull(Availability) ||
    isNull(youtubeLinks) ||
    isNull(manual) ||
    !product_details ||
    isNull(features) ||
    isNull(useCase)
  ) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
      responsecode: 1,
    });
  }

  // Split `showIn`, `youtubeLinks`, and `manual` into arrays
  const parsedShowIn = showIn.split(',').map(item => item.trim());
  const parsedYoutubeLinks = youtubeLinks.split(',').map(item => item.trim());
  const parsedManual = manual.split(',').map(item => item.trim());

  // Parse JSON fields
  const parsedSpecifications = parseJSON(specifications, {});
  const parsedTags = parseJSON(tags, []);
  
  // Validate parsed specifications
  if (specifications && !parsedSpecifications) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format in specifications",
      responsecode: 2,
    });
  }

  try {
    // Prepare image URLs
    const imageUrls = req.files.map((file) => `https://${domain}/uploads/productImages/${file.filename}`);

    // Verify user role
    getUserProfileFromToken(token, async (err, foundUser) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message, responsecode: 3 });
      }
      if (!foundUser || foundUser.role !== "admin") {
        return res.status(403).json({ success: false, message: "Access denied: Admin role required", responsecode: 7 });
      }

      // Insert product data into the database
      const insertQuery = `
        INSERT INTO public."Products"(
          name, description, price_in_usd, price_in_inr, "discountPrice", stock, 
          "categoryId", "brandId", rating, images, "showIn", tags, specifications, 
          "isPublished", "Availability", "youtubeLinks", manual, product_details, features, "useCase"
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`;

      const insertValues = [
        name,
        description,
        parseFloat(price_in_usd),
        parseFloat(price_in_inr),
        parseFloat(discountPrice),
        parseInt(stock),
        categoryId,
        brandId,
        parseFloat(rating),
        JSON.stringify(imageUrls),
        JSON.stringify(parsedShowIn), // store the parsed array here
        tags,
        parsedSpecifications,
        isPublished === "true" || isPublished === true,
        Availability,
        JSON.stringify(parsedYoutubeLinks), // store the parsed array here
        JSON.stringify(parsedManual), // store the parsed array here
        product_details,
        features,
        useCase
      ];

      try {
        client.query(insertQuery, insertValues, async (err, insertedProduct) => {
          if (err) {
            return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
          } else if (insertedProduct.rowCount === 1) {
            return res.status(201).json({ success: true, message: "Product added successfully", responsecode: 4 });
          } else {
            return res.status(500).json({ success: false, message: "Failed to insert product", responsecode: 5 });
          }
        });
      } catch (dbError) {
        return res.status(500).json({ success: false, message: dbError.message, debug: dbError, responsecode: 6 });
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, debug: error, responsecode: 6 });
  }
};

// manual pdf uplaod (Admin Only)
exports.productManual = async (req, res) => {
  const { token, productId } = req.body;
  if (!token || !productId) {
    return res.status(400).json({ success: false, message: "Missing required fields (token or productId)", responsecode: 1 });
  } else {
    if (!req.file || req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ success: false, message: "Invalid or missing file (only PDF allowed)", responsecode: 2 });
    }

    const pdfUrl = `https://${domain}/uploads/productManuals/${req.file.filename}`;

    getUserProfileFromToken(token, async (err, foundUser) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message, responsecode: 3 });
      } else if (foundUser.role !== "admin") {
        return res.status(403).json({ success: false, message: "Access denied: Admin role required", responsecode: 4 });
      } else {
        try {
          const checkQuery = `SELECT manual FROM public."Products" WHERE id = $1`;
          const checkResult = await client.query(checkQuery, [productId]);

          if (checkResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found", responsecode: 5 });
          }

          const existingManual = checkResult.rows[0].manual;
          if (existingManual && existingManual.length > 0) {
            const oldPdfUrl = existingManual[0];
            const oldFileName = oldPdfUrl.split('/uploads/productManuals/')[1];
            const oldFilePath = path.join(__dirname, '..', 'uploads', 'productManuals', oldFileName);

            if (fs.existsSync(oldFilePath)) {
              fs.unlink(oldFilePath, (err) => {
                if (err) {
                  console.error(`Failed to delete old manual file: ${oldFilePath}`, err);
                } else {
                  console.log(`Old manual file deleted: ${oldFilePath}`);
                }
              });
            }
          }

          // Update the database with the new manual
          const updateQuery = `UPDATE public."Products" SET manual = $1 WHERE id = $2`;
          const updateResult = await client.query(updateQuery, [JSON.stringify([pdfUrl]), productId]);

          if (updateResult.rowCount === 1) {
            return res.status(201).json({ success: true, message: "Manual uploaded successfully", responsecode: 6 });
          } else {
            return res.status(500).json({ success: false, message: "Failed to update manual", responsecode: 7 });
          }
        } catch (error) {
          console.error("Error during manual upload:", error);
          return res.status(500).json({ success: false, message: error.message, debug: error, responsecode: 8 });
        }
      }
    });
  }
};

//Update Product by admin user
exports.updateProduct = async (req, res) => {
  const {
    id,
    name,
    description,
    price_in_usd,
    price_in_inr,
    discountPrice,
    stock,
    categoryId,
    brandId,
    rating,
    showIn,
    tags,
    specifications,
    isPublished,
    Availability,
    youtubeLinks,
    manual,
    product_details,
    features,
    token,
    useCase
  } = req.body;

  const parseJSON = (data, defaultValue = []) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      return defaultValue;
    }
  };

  if (!id || !token) {
    return res.status(400).json({ success: false, message: "Missing required fields (id or token)", responsecode: 1 });
  }

  try {
    getUserProfileFromToken(token, async (err, foundUser) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message, responsecode: 3 });
      }

      if (!foundUser || foundUser.role !== "admin") {
        return res.status(403).json({ success: false, message: "Access denied: Admin role required", responsecode: 7 });
      }

      const imageUrls = req.files.map((file) => `https://${domain}/uploads/productImages/${file.filename}`);

      const parsedSpecifications = parseJSON(specifications, []);
      const parsedYoutubeLinks = parseJSON(youtubeLinks, []);
      const parsedManual = parseJSON(manual, []);
      const parsedFeatures = parseJSON(features, []);
      const parsedshowIn = parseJSON(showIn, []);

      const updateQuery = `
        UPDATE public."Products"
        SET 
          name = COALESCE($2, name),
          description = COALESCE($3, description),
          price_in_usd = COALESCE($4, price_in_usd),
          price_in_inr = COALESCE($5, price_in_inr),
          "discountPrice" = COALESCE($6, "discountPrice"),
          stock = COALESCE($7, stock),
          "categoryId" = COALESCE($8, "categoryId"),
          "brandId" = COALESCE($9, "brandId"),
          rating = COALESCE($10, rating),
          images = COALESCE($11, images),
          "showIn" = COALESCE($12, "showIn"),
          tags = COALESCE($13, tags),
          specifications = COALESCE($14, specifications),
          "isPublished" = COALESCE($15, "isPublished"),
          "Availability" = COALESCE($16, "Availability"),
          "youtubeLinks" = COALESCE($17, "youtubeLinks"),
          manual = COALESCE($18, manual),
          product_details = COALESCE($19, product_details),
          features = COALESCE($20, features),
          "useCase" = COALESCE($21, "useCase"),
          "updatedAt" = now()
        WHERE id = $1
        RETURNING *;
      `;

      const updateValues = [
        id,
        name,
        description,
        parseFloat(price_in_usd) || null,
        parseFloat(price_in_inr) || null,
        parseFloat(discountPrice) || null,
        parseInt(stock) || null,
        categoryId || null,
        brandId || null,
        parseFloat(rating) || null,
        imageUrls ? JSON.stringify(imageUrls) : null,
        parsedshowIn || null,
        tags || null,
        parsedSpecifications || null,
        isPublished === "true" || isPublished === true,
        Availability || null,
        parsedYoutubeLinks || null,
        parsedManual || null,
        product_details || null,
        parsedFeatures,
        useCase || false,
      ];

      try {
        const result = await client.query(updateQuery, updateValues);

        if (result.rowCount === 1) {
          return res.status(200).json({ success: true, message: "Product updated successfully", data: result.rows[0], responsecode: 4 });
        } else {
          return res.status(404).json({ success: false, message: "Product not found", responsecode: 5 });
        }
      } catch (dbError) {
        return res.status(500).json({ success: false, message: dbError.message, debug: dbError, responsecode: 6 });
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, debug: error, responsecode: 6 });
  }
};

// Delete a product (Admin Only)
exports.deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  const { token } = req.body;
  if (!id || !token) {
    return res.status(400).json({ success: false, message: "Missing required fields", responsecode: 400 });
  }
  getUserProfileFromToken(token, async (err, foundUser) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
    } else if (foundUser.role === "admin") {
      try {
        const deleteQuery = `DELETE FROM "Products" WHERE id = $1 RETURNING *`;
        const result = await client.query(deleteQuery, [id]);
        if (result.rowCount > 0) {
          return res.status(200).json({ success: true, message: "Product deleted successfully", data: result.rows[0], responsecode: 200 });
        } else {
          return res.status(404).json({ success: false, message: "Product not found", responsecode: 404 });
        }
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message, responsecode: 500 });
      }
    } else {
      return res.status(403).json({ success: false, message: "Access denied: Admin role required", responsecode: 403 });
    }
  });
};


exports.productSearch = async (req, res, nex) => {
  const { SearchKey } = req.query;
  if (!SearchKey) {
    return res.status(400).json({ success: false, message: "Search key is required", responsecode: 1 });
  } else {
    try {
      const searchQuery = `SELECT id,name, price_in_usd, rating, price_in_inr, description, images FROM  public."Products" WHERE  ("isPublished" = true)  AND  (LOWER(name) LIKE LOWER('%${SearchKey}%') OR LOWER(description) LIKE LOWER('%${SearchKey}%'))`;
      const result = await client.query(searchQuery);
      if (result.rowCount > 0) {
        return res.status(200).json({ success: true, message: "Products found", data: result.rows, responsecode: 200 });
      } else {
        return res.status(404).json({ success: false, message: "No products found matching the search criteria", responsecode: 404 });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message, responsecode: 500 });
    }
  };
};