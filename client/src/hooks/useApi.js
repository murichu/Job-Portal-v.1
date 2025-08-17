import { useState, useCallback } from 'react';
import { handleError } from '../utils/errorHandler';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall, options = {}) => {
    const { 
      showErrorToast = true, 
      customErrorMessage = null,
      onSuccess = null,
      onError = null 
    } = options;

    try {
      setLoading(true);
      setError(null);
      
      const result = await apiCall();
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      setError(err);
      
      if (showErrorToast) {
        handleError(err, customErrorMessage);
      }
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    reset
  };
};

// Hook for form submissions
export const useFormSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const submit = useCallback(async (submitFn, options = {}) => {
    const { onSuccess, onError, showErrorToast = true } = options;

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      const result = await submitFn();
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (error) {
      setSubmitError(error);
      
      if (showErrorToast) {
        handleError(error);
      }
      
      if (onError) {
        onError(error);
      }
      
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    isSubmitting,
    submitError,
    submit
  };
};