// middleware/validation.js - Validation middleware for products

const { ValidationError } = require('../utils/errors');

const validateProduct = (req, res, next) => {
  const { name, description, price, category } = req.body;
  const errors = [];
  
  // Validate required fields
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }
  
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.push('Description is required and must be a non-empty string');
  }
  
  if (price === undefined || price === null) {
    errors.push('Price is required');
  } else if (typeof price !== 'number' || price < 0) {
    errors.push('Price must be a non-negative number');
  }
  
  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    errors.push('Category is required and must be a non-empty string');
  }
  
  // Validate optional fields
  if (req.body.inStock !== undefined && typeof req.body.inStock !== 'boolean') {
    errors.push('inStock must be a boolean value');
  }
  
  // Validate string lengths
  if (name && name.length > 100) {
    errors.push('Name must be less than 100 characters');
  }
  
  if (description && description.length > 500) {
    errors.push('Description must be less than 500 characters');
  }
  
  if (category && category.length > 50) {
    errors.push('Category must be less than 50 characters');
  }
  
  // Validate price range
  if (price && price > 999999.99) {
    errors.push('Price must be less than $999,999.99');
  }
  
  if (errors.length > 0) {
    throw new ValidationError(`Validation failed: ${errors.join(', ')}`);
  }
  
  next();
};

const validateProductUpdate = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  const errors = [];
  
  // For updates, fields are optional but must be valid if provided
  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      errors.push('Name must be a non-empty string');
    } else if (name.length > 100) {
      errors.push('Name must be less than 100 characters');
    }
  }
  
  if (description !== undefined) {
    if (typeof description !== 'string' || description.trim().length === 0) {
      errors.push('Description must be a non-empty string');
    } else if (description.length > 500) {
      errors.push('Description must be less than 500 characters');
    }
  }
  
  if (price !== undefined) {
    if (typeof price !== 'number' || price < 0) {
      errors.push('Price must be a non-negative number');
    } else if (price > 999999.99) {
      errors.push('Price must be less than $999,999.99');
    }
  }
  
  if (category !== undefined) {
    if (typeof category !== 'string' || category.trim().length === 0) {
      errors.push('Category must be a non-empty string');
    } else if (category.length > 50) {
      errors.push('Category must be less than 50 characters');
    }
  }
  
  if (inStock !== undefined && typeof inStock !== 'boolean') {
    errors.push('inStock must be a boolean value');
  }
  
  // Ensure at least one field is provided for update
  if (Object.keys(req.body).length === 0) {
    errors.push('At least one field must be provided for update');
  }
  
  if (errors.length > 0) {
    throw new ValidationError(`Validation failed: ${errors.join(', ')}`);
  }
  
  next();
};

module.exports = {
  validateProduct,
  validateProductUpdate
};
