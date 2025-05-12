const express = require('express');
const router = express.Router();
const multer = require("multer");
// const multerS3 = require('multer-s3');
const path = require('path');

const PicUpload = process.env.NODE_ENV === 'production'
    ? '/opt/uploads/profilePics' // For production on VPS
    : path.join(__dirname, '../uploads/profilePics'); // For local development

const profilePicUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, PicUpload); // Set the destination folder
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
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10 MB
    fileFilter(req, file, cb) {
        if (!file) {
            cb(new Error('No file passed'), false);
        } else if (file.mimetype.startsWith('image/')) {
            cb(null, true); // Accept the file
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});


module.exports = profilePicUpload;