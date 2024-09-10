// const factory = require('./handlersFactory');
// const SubCategory = require('../models/subCategoryModel');
// const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
// const asyncHandler = require('express-async-handler');
// const { v4: uuidv4 } = require('uuid');
// const sharp = require('sharp');



// // Upload single image
// exports.uploadSubCategoryImage = uploadSingleImage('image');

// // Image processing
// exports.resizeImage = asyncHandler(async (req, res, next) => {
//   const filename = `subcategory-${uuidv4()}-${Date.now()}.jpeg`;

//   if (req.file) {

//     console.log("start")
//     await sharp(req.file.buffer)
//       .resize(600, 600)
//       .toFormat('jpeg')
//       .jpeg({ quality: 95 })
//       .toFile(`uploads/subcategories/${filename}`);
//     console.log("end")
//     // Save image into our db
//     req.body.image = filename;
//   }

//   next();
// });





// exports.setCategoryIdToBody = (req, res, next) => {
//   // Nested route (Create)
//   if (!req.body.category) req.body.category = req.params.categoryId;
//   next();
// };

// // Nested route
// // GET /api/v1/categories/:categoryId/subcategories
// exports.createFilterObj = (req, res, next) => {
//   let filterObject = {};
//   if (req.params.categoryId) filterObject = { category: req.params.categoryId };
//   req.filterObj = filterObject;
//   next();
// };

// // @desc    Get list of subcategories
// // @route   GET /api/v1/subcategories
// // @access  Public
// exports.getSubCategories = factory.getAll(SubCategory);

// // @desc    Get specific subcategory by id
// // @route   GET /api/v1/subcategories/:id
// // @access  Public
// exports.getSubCategory = factory.getOne(SubCategory);

// // @desc    Create subCategory
// // @route   POST  /api/v1/subcategories
// // @access  Private
// exports.createSubCategory = factory.createOne(SubCategory);

// // @desc    Update specific subcategory
// // @route   PUT /api/v1/subcategories/:id
// // @access  Private
// exports.updateSubCategory = factory.updateOne(SubCategory);

// // @desc    Delete specific subCategory
// // @route   DELETE /api/v1/subcategories/:id
// // @access  Private
// exports.deleteSubCategory = factory.deleteOne(SubCategory);


const factory = require('./handlersFactory');
const SubCategory = require('../models/subCategoryModel');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');


// Firebase initialization
const { initializeApp } = require("firebase/app");
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage");
const firebaseConfig = require('../utils/firebase');

initializeApp(firebaseConfig);
const storage = getStorage();

// Upload single image
exports.uploadSubCategoryImage = uploadSingleImage('image');

// Image processing and upload to Firebase
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `subcategory-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    const buffer = await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toBuffer();

    const downloadURL = await uploadToFirebase(buffer, filename);
    req.body.image = downloadURL;
  }

  next();
});

// Function to upload image buffer to Firebase Storage
const uploadToFirebase = async (buffer, fileName) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `subcategories/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, buffer, { contentType: 'image/jpeg' });

    uploadTask.on(
      'state_changed',
      (snapshot) => { },
      (error) => {
        reject(new Error(error.message));
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
};

exports.setCategoryIdToBody = (req, res, next) => {
  // Nested route (Create)
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// Nested route
// GET /api/v1/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

// @desc    Get list of subcategories
// @route   GET /api/v1/subcategories
// @access  Public
exports.getSubCategories = factory.getAll(SubCategory);

// @desc    Get specific subcategory by id
// @route   GET /api/v1/subcategories/:id
// @access  Public
exports.getSubCategory = factory.getOne(SubCategory);

// @desc    Create subCategory
// @route   POST  /api/v1/subcategories
// @access  Private
exports.createSubCategory = factory.createOne(SubCategory);

// @desc    Update specific subcategory
// @route   PUT /api/v1/subcategories/:id
// @access  Private
exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc    Delete specific subCategory
// @route   DELETE /api/v1/subcategories/:id
// @access  Private
exports.deleteSubCategory = factory.deleteOne(SubCategory);
