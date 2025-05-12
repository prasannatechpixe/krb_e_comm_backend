const express = require('express');
const router = express.Router();
const multer = require("multer");
// const multerS3 = require('multer-s3');
const path = require('path');

const uploadDir = process.env.NODE_ENV === 'production'
    ? '/opt/uploads/productManuals' // For production on VPS
    : path.join(__dirname, '../uploads/productManuals'); // For local development

const pdfUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            // Function to sanitize the filename
            const sanitizeFileName = (filename) => {
                return filename
                    .toLowerCase() // Convert to lowercase
                    .replace(/\s+/g, '-') // Replace spaces with hyphens
                    .replace(/[^a-z0-9.\-_]/g, ''); // Remove invalid characters
            };

            const sanitizedOriginalName = sanitizeFileName(file.originalname);
            const uniqueSuffix = `${Date.now()}-${sanitizedOriginalName}`; // Create a unique filename

            if (!req.savedFileNames) {
                req.savedFileNames = []; // Initialize array to store filenames
            }
            req.savedFileNames.push(uniqueSuffix); // Push sanitized filename to the array

            cb(null, uniqueSuffix); // Save file with sanitized filename
        },
    }),
    limits: { fileSize: 15 * 1024 * 1024 }, // Limit file size to 15 MB
    fileFilter(req, file, cb) {
        if (!file) {
            cb(new Error('No file passed'), false);
        } else if (file.mimetype === 'application/pdf') {
            cb(null, true); // Accept PDF files only
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    },
});


module.exports = pdfUpload;