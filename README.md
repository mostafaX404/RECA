# RECA - eCommerce Platform

## Overview

RECA is a Node.js-based eCommerce platform designed to provide seamless management of products, customers, and orders. It follows a modular architecture with separate services for authentication, product catalog, and order management, ensuring scalability and maintainability.

## Features
- Product management (CRUD operations).
- Customer authentication and authorization.
- Shopping cart and checkout process.
- Order management system.
- Payment integration.

## Technologies Used
- **Node.js**: Server-side JavaScript runtime.
- **Express**: Web framework for handling routing and middleware.
- **MongoDB**: NoSQL database for storing product and user data.
- **JWT**: Secure user authentication via tokens.
- **Stripe**: Integrated for payment processing.

## Folder Structure

- **config/**: Configuration for environment variables, database, etc.
- **middlewares/**: Custom middleware for authentication, validation, and error handling.
- **models/**: MongoDB models for products, orders, and users.
- **routes/**: Defines the API endpoints for managing users, products, and orders.
- **services/**: Business logic for user, product, and order handling.
- **utils/**: Helper functions for token generation, formatting, etc.

## Installation

To install and run RECA locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/mostafaX404/RECA.git
   cd RECA
