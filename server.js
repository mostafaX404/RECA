const path = require('path');

const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');

dotenv.config({ path: 'config.env' });
const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/errorMiddleware');
const dbConnection = require('./config/database');
// Routes
const mountRoutes = require('./routes');
const { webhookCheckout } = require('./services/orderService');

const { rateLimit } = require('express-rate-limit')
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean')



// Connect with db
dbConnection();

// express app
const app = express();

// Enable other domains to access your application
app.use(cors());
app.options('*', cors());

// compress all responses
app.use(compression());

// Checkout webhook
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout
);

// Middlewares
app.use(express.json({ limit: '10000' })); //Set request size limit 
// app.use(express.json({ limit: '100' })); //Set request size limit 

app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// To remove data using these defaults:
//Perform input validation to prevent NoSQL query injection :
app.use(mongoSanitize());
app.use(xss())


//Take precautions against brute-forcing
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   limit: 100,
//   message: 'too many accounts has been created from this ip , please try again later'
// })



//Prevent HTTP Parameter Pollution
app.use(hpp({ whitelist: ['price', 'sold', 'quantity', 'ratingsAverage', 'ratingsQuantity'] }));

// Apply the rate limiting middleware to all requests.
// app.use('/api', limiter)


// Mount Routes
mountRoutes(app);

app.all('*', (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});

// Handle rejection outside express
process.on('unhandledRejection', (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
