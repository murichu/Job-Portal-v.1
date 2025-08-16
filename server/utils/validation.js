import Joi from 'joi';

// User registration validation schema
export const userRegistrationSchema = Joi.object({
  name: Joi.string().min(2).max(50).trim().required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required()
    .messages({
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
    })
});

// User login validation schema
export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Company registration validation schema
export const companyRegistrationSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required(),
  recruiterName: Joi.string().min(2).max(50).trim().required(),
  recruiterPosition: Joi.string().min(2).max(50).trim().required(),
  companyPhone: Joi.string().min(10).max(15).trim().required(),
  companyLocation: Joi.string().min(2).max(100).trim().required()
});

// Job posting validation schema
export const jobPostingSchema = Joi.object({
  title: Joi.string().min(3).max(100).trim().required(),
  description: Joi.string().min(50).required(),
  location: Joi.string().min(2).max(50).required(),
  category: Joi.string().valid('Programming', 'Data Science', 'Designing', 'Networking', 'Management', 'Marketing', 'Cybersecurity').required(),
  level: Joi.string().valid('Beginner level', 'Intermediate level', 'Senior level').required(),
  salary: Joi.number().min(0).max(1000000).required()
});

// Job application validation schema
export const jobApplicationSchema = Joi.object({
  jobId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
});

// Application status update validation schema
export const applicationStatusSchema = Joi.object({
  applicationId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  status: Joi.string().valid('Pending', 'Accepted', 'Rejected').required()
});