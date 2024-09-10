// const sharp = require('sharp');
// const { v4: uuidv4 } = require('uuid');
// const asyncHandler = require('express-async-handler');

// const factory = require('./handlersFactory');
// const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
// const Category = require('../models/categoryModel');

// // Upload single image
// exports.uploadCategoryImage = uploadSingleImage('image');

// // Image processing
// exports.resizeImage = asyncHandler(async (req, res, next) => {


//   const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
//   if (req.file) {
//     await sharp(req.file.buffer)
//       .resize(600, 600)
//       .toFormat('jpeg')
//       .jpeg({ quality: 95 })
//       .toFile(`uploads/categories/${filename}`);
//     // Save image into our db
//     req.body.image = filename;
//   }
//   next();
// });

// // @desc    Get list of categories
// // @route   GET /api/v1/categories
// // @access  Public
// exports.getCategories = factory.getAll(Category);

// // @desc    Get specific category by id
// // @route   GET /api/v1/categories/:id
// // @access  Public
// exports.getCategory = factory.getOne(Category);

// // @desc    Create category
// // @route   POST  /api/v1/categories
// // @access  Private/Admin-Manager
// exports.createCategory = factory.createOne(Category);

// // @desc    Update specific category
// // @route   PUT /api/v1/categories/:id
// // @access  Private/Admin-Manager
// exports.updateCategory = factory.updateOne(Category);

// // @desc    Delete specific category
// // @route   DELETE /api/v1/categories/:id
// // @access  Private/Admin
// exports.deleteCategory = factory.deleteOne(Category);



const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const { ref, getStorage, getDownloadURL, uploadBytesResumable } = require("firebase/storage");
const { initializeApp } = require("firebase/app");
const asyncHandler = require('express-async-handler');

const factory = require('./handlersFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const Category = require('../models/categoryModel');
const firebaseConfig = require('../utils/firebase');
const ApiError = require('../utils/apiError');

// Initialize Firebase
initializeApp(firebaseConfig);
const storage = getStorage();

// Middleware to upload single category image
exports.uploadCategoryImage = uploadSingleImage('image');

// Function to upload file to Firebase Storage
const uploadToFirebase = async (buffer, fileName) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `categories/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, buffer, { contentType: 'image/jpeg' });

    uploadTask.on(
      'state_changed',
      (snapshot) => { },
      (error) => {
        reject(new ApiError(error.message, 500));
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
};

// Middleware to resize and upload category image to Firebase
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

    const buffer = await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toBuffer();

    const downloadURL = await uploadToFirebase(buffer, filename);
    req.body.image = downloadURL; // Save image URL into req.body
  }
  next();
});

// CRUD operations for categories
exports.getCategories = factory.getAll(Category);
exports.getCategory = factory.getOne(Category);
exports.createCategory = factory.createOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);
