import validator from "validator";
import { AppError } from "./errorHandler.js";

// Common validation rules
export const validationRules = {
  email: (email) => {
    if (!email) throw new AppError("Email is required", 400);
    if (!validator.isEmail(email)) throw new AppError("Invalid email format", 400);
    return email.trim().toLowerCase();
  },

  password: (password) => {
    if (!password) throw new AppError("Password is required", 400);
    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })) {
      throw new AppError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol",
        400
      );
    }
    return password;
  },

  name: (name) => {
    if (!name) throw new AppError("Name is required", 400);
    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 50) {
      throw new AppError("Name must be between 2 and 50 characters", 400);
    }
    return trimmedName;
  },

  phone: (phone) => {
    if (!phone) throw new AppError("Phone number is required", 400);
    const trimmedPhone = phone.trim();
    if (!validator.isMobilePhone(trimmedPhone)) {
      throw new AppError("Invalid phone number format", 400);
    }
    return trimmedPhone;
  },

  mongoId: (id) => {
    if (!id) throw new AppError("ID is required", 400);
    if (!validator.isMongoId(id)) throw new AppError("Invalid ID format", 400);
    return id;
  },

  salary: (salary) => {
    const numSalary = Number(salary);
    if (isNaN(numSalary) || numSalary < 0) {
      throw new AppError("Salary must be a positive number", 400);
    }
    return numSalary;
  }
};

// Validation middleware factory
export const validateBody = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = {};
      
      for (const [field, validator] of Object.entries(schema)) {
        if (req.body[field] !== undefined) {
          validatedData[field] = validator(req.body[field]);
        }
      }
      
      req.validatedBody = validatedData;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// File validation middleware
export const validateFile = (options = {}) => {
  return (req, res, next) => {
    try {
      const { required = false, types = [], maxSize = 10 * 1024 * 1024 } = options;
      
      if (required && !req.file) {
        throw new AppError("File is required", 400);
      }
      
      if (req.file) {
        if (types.length > 0 && !types.includes(req.file.mimetype)) {
          throw new AppError(`Invalid file type. Allowed types: ${types.join(', ')}`, 400);
        }
        
        if (req.file.size > maxSize) {
          throw new AppError(`File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`, 400);
        }
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};