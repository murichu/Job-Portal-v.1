import { toast } from "react-toastify";

// Error types
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTH: 'AUTH_ERROR',
  SERVER: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

// Error messages mapping
const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK]: "Network error. Please check your connection and try again.",
  [ERROR_TYPES.VALIDATION]: "Please check your input and try again.",
  [ERROR_TYPES.AUTH]: "Authentication failed. Please login again.",
  [ERROR_TYPES.SERVER]: "Server error. Please try again later.",
  [ERROR_TYPES.UNKNOWN]: "Something went wrong. Please try again."
};

// Determine error type from error object
export const getErrorType = (error) => {
  if (!error.response) {
    return ERROR_TYPES.NETWORK;
  }
  
  const status = error.response.status;
  
  if (status >= 400 && status < 500) {
    if (status === 401 || status === 403) {
      return ERROR_TYPES.AUTH;
    }
    return ERROR_TYPES.VALIDATION;
  }
  
  if (status >= 500) {
    return ERROR_TYPES.SERVER;
  }
  
  return ERROR_TYPES.UNKNOWN;
};

// Get user-friendly error message
export const getErrorMessage = (error) => {
  // Try to get message from response
  const responseMessage = error.response?.data?.message;
  if (responseMessage) {
    return responseMessage;
  }
  
  // Fallback to error type message
  const errorType = getErrorType(error);
  return ERROR_MESSAGES[errorType];
};

// Handle and display error
export const handleError = (error, customMessage = null) => {
  const message = customMessage || getErrorMessage(error);
  const errorType = getErrorType(error);
  
  // Log error for debugging
  console.error('Error occurred:', {
    type: errorType,
    message,
    originalError: error
  });
  
  // Show toast notification
  toast.error(message);
  
  // Handle auth errors
  if (errorType === ERROR_TYPES.AUTH) {
    // Clear tokens and redirect to login
    localStorage.removeItem('Token');
    localStorage.removeItem('companyToken');
    window.location.href = '/';
  }
  
  return { type: errorType, message };
};

// Async error wrapper for components
export const withErrorHandling = (asyncFn, customErrorMessage = null) => {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      handleError(error, customErrorMessage);
      throw error; // Re-throw for component-specific handling
    }
  };
};

// Form validation helper
export const validateForm = (data, rules) => {
  const errors = {};
  
  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];
    
    if (rule.required && (!value || value.toString().trim() === '')) {
      errors[field] = `${field} is required`;
      continue;
    }
    
    if (value && rule.minLength && value.length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
      continue;
    }
    
    if (value && rule.maxLength && value.length > rule.maxLength) {
      errors[field] = `${field} must be less than ${rule.maxLength} characters`;
      continue;
    }
    
    if (value && rule.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.message || `${field} format is invalid`;
      continue;
    }
    
    if (rule.custom && !rule.custom(value)) {
      errors[field] = rule.message || `${field} is invalid`;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};