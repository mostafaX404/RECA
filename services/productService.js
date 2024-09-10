// const asyncHandler = require('express-async-handler');
// const { v4: uuidv4 } = require('uuid');
// const sharp = require('sharp');

// const { initializeApp } = require("firebase/app")
// const { ref, getStorage, getDownloadURL, uploadBytesResumable } = require("firebase/storage")

// const { uploadMixOfImages } = require('../middlewares/uploadImageMiddleware');
// const factory = require('./handlersFactory');
// const Product = require('../models/productModel');
// const firebaseConfig = require('../utils/firebase');


// initializeApp(firebaseConfig)
// const storage = getStorage()

// exports.uploadProductImages = uploadMixOfImages([
//   {
//     name: 'imageCover',
//     maxCount: 1,
//   },
//   {
//     name: 'images',
//     maxCount: 5,
//   },
// ]);



// exports.setSubCategoryToBody = (req, res, next) => {
//   // Nested route (Create)
//   if (!req.body.subcategory) req.body.subcategory = req.params.subcategoryId;
//   next();
// };

// // Nested route
// // GET /api/v1/categories/:subcategoryId/products
// exports.createFilterObj = (req, res, next) => {
//   let filterObject = {};
//   if (req.params.subcategoryId) filterObject = { subcategory: req.params.subcategoryId };
//   req.filterObj = filterObject;
//   next();
// };

// const uploadToFirebase = async (buffer, fileName) => {
//   return new Promise((resolve, reject) => {
//     const storageRef = ref(storage, `products/${fileName}`);
//     const uploadTask = uploadBytesResumable(storageRef, buffer, { contentType: 'image/jpeg' });

//     uploadTask.on(
//       'state_changed',
//       (snapshot) => { },
//       (error) => {
//         reject(new ApiError(error.message, 500));
//       },
//       async () => {
//         const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//         resolve(downloadURL);
//       }
//     );
//   });
// };


// exports.resizeProductImages = asyncHandler(async (req, res, next) => {
//   if (req.files.imageCover) {
//     const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

//     const buffer = await sharp(req.files.imageCover[0].buffer)
//       .resize(2000, 1333)
//       .toFormat('jpeg')
//       .jpeg({ quality: 95 })
//       .toBuffer();

//     const downloadURL = await uploadToFirebase(buffer, imageCoverFileName);
//     req.body.imageCover = downloadURL;
//   }

//   if (req.files.images) {
//     req.body.images = [];
//     await Promise.all(
//       req.files.images.map(async (img, index) => {
//         const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

//         const buffer = await sharp(img.buffer)
//           .resize(2000, 1333)
//           .toFormat('jpeg')
//           .jpeg({ quality: 95 })
//           .toBuffer();

//         const downloadURL = await uploadToFirebase(buffer, imageName);
//         req.body.images.push(downloadURL);
//       })
//     );
//   }

//   next();
// });


// // exports.resizeProductImages = asyncHandler(async (req, res, next) => {
// //   //1- Image processing for imageCover
// //   if (req.files.imageCover) {

// //     const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

// //     await sharp(req.files.imageCover[0].buffer)
// //       .resize(2000, 1333)
// //       .toFormat('jpeg')
// //       .jpeg({ quality: 95 })
// //       .toFile(`uploads/products/${imageCoverFileName}`);

// //     // Save image into our db
// //     req.body.imageCover = imageCoverFileName;
// //   }
// //   //2- Image processing for images
// //   if (req.files.images) {

// //     req.body.images = [];
// //     await Promise.all(
// //       req.files.images.map(async (img, index) => {
// //         const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

// //         await sharp(img.buffer)
// //           .resize(2000, 1333)
// //           .toFormat('jpeg')
// //           .jpeg({ quality: 95 })
// //           .toFile(`uploads/products/${imageName}`);

// //         // Save image into our db
// //         req.body.images.push(imageName);
// //       })
// //     );

// //     next();
// //   }
// //   //3-for skipping it during update
// //   if (!(req.files.images) || !(req.files.imageCover)) {
// //     next()
// //   }
// // });

// // @desc    Get list of products
// // @route   GET /api/v1/products
// // @access  Public
// exports.getProducts = factory.getAll(Product, 'Products');

// // @desc    Get specific product by id
// // @route   GET /api/v1/products/:id
// // @access  Public
// exports.getProduct = factory.getOne(Product, 'reviews');

// // @desc    Create product
// // @route   POST  /api/v1/products
// // @access  Private
// exports.createProduct = factory.createOne(Product);
// // @desc    Update specific product
// // @route   PUT /api/v1/products/:id
// // @access  Private
// exports.updateProduct = factory.updateOne(Product);

// // @desc    Delete specific product
// // @route   DELETE /api/v1/products/:id
// // @access  Private
// exports.deleteProduct = factory.deleteOne(Product);






const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const { ref, getStorage, getDownloadURL, uploadBytesResumable } = require("firebase/storage");

const { uploadMixOfImages } = require('../middlewares/uploadImageMiddleware');
const factory = require('./handlersFactory');
const Product = require('../models/productModel');
const firebaseConfig = require('../utils/firebase');
const { initializeApp } = require("firebase/app");

initializeApp(firebaseConfig);
const storage = getStorage();

exports.uploadProductImages = uploadMixOfImages([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 5 },
]);

exports.setSubCategoryToBody = (req, res, next) => {
  if (!req.body.subcategory) req.body.subcategory = req.params.subcategoryId;
  next();
};

exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.subcategoryId) filterObject = { subcategory: req.params.subcategoryId };
  req.filterObj = filterObject;
  next();
};

const uploadToFirebase = async (buffer, fileName) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `products/${fileName}`);
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

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    const buffer = await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toBuffer();

    const downloadURL = await uploadToFirebase(buffer, imageCoverFileName);
    req.body.imageCover = downloadURL;
  }

  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        const buffer = await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 95 })
          .toBuffer();

        const downloadURL = await uploadToFirebase(buffer, imageName);
        req.body.images.push(downloadURL);
      })
    );
  }

  next();
});



exports.getProducts = factory.getAll(Product, 'Products');
exports.getProduct = factory.getOne(Product, 'reviews');
// exports.createProduct = factory.createOne(Product);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);



exports.createProduct = asyncHandler(async (req, res, next) => {
  req.body.seller = {
    _id: req.user._id,
    name: req.user.name
  };

  const product = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      product
    }
  });
});