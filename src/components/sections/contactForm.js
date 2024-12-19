import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFormData, submitContactForm, resetForm, getTimeUntilNextSubmission } from '../../features/contact/contactSlice';

const ContactForm = () => {
  const dispatch = useDispatch();
  const { formData, status, error } = useSelector((state) => state.contact);
  const [validationErrors, setValidationErrors] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);

  // Check and update throttle timer
  useEffect(() => {
    const checkThrottle = () => {
      const remainingTime = getTimeUntilNextSubmission();
      setTimeLeft(remainingTime);
    };

    checkThrottle();
    const interval = setInterval(checkThrottle, 60000);

    return () => clearInterval(interval);
  }, []);

  // Warning for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (formData.name || formData.email || formData.phone || formData.message) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData]);

  // Auto-save feedback
  useEffect(() => {
    if (Object.values(formData).some(value => value)) {
      setShowSaveIndicator(true);
      const timer = setTimeout(() => setShowSaveIndicator(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [formData]);

  // Format phone number as user types
  const formatPhoneNumber = (value) => {
    if (!value) return value;
    
    const phoneNumber = value.replace(/[^\d]/g, '');
    
    if (phoneNumber.length < 4) return phoneNumber;
    if (phoneNumber.length < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  // Format remaining time for display
  const formatTimeLeft = (ms) => {
    if (ms <= 0) return '';
    const minutes = Math.ceil(ms / 60000);
    return `Please wait ${minutes} minute${minutes > 1 ? 's' : ''} before submitting another message.`;
  };

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'Name contains invalid characters';
        return '';

      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
        return '';

      case 'phone':
        if (value.trim()) {
          const digits = value.replace(/\D/g, '');
          if (digits.length !== 10) {
            return 'Phone number must be 10 digits';
          }
        }
        return '';

      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.trim().length < 10) return 'Message must be at least 10 characters';
        if (value.trim().length > 500) return 'Message must not exceed 500 characters';
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'phone') {
      formattedValue = formatPhoneNumber(value);
    }

    dispatch(updateFormData({ [name]: formattedValue }));
    
    const error = validateField(name, formattedValue);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) errors[key] = error;
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const sanitizedData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        message: formData.message.trim()
      };
      dispatch(submitContactForm(sanitizedData));
    }
  };

  const handleReset = () => {
    dispatch(resetForm());
    setValidationErrors({});
  };

  // Character counter for message
  const remainingChars = 500 - (formData.message?.length || 0);

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h2>
        
        {timeLeft > 0 && (
          <div className="mb-6 p-4 bg-yellow-100 text-yellow-800 rounded">
            {formatTimeLeft(timeLeft)}
          </div>
        )}
        
        {status === 'succeeded' && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded">
            Thank you for your message. We'll be in touch soon!
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none ${
                validationErrors.name 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              aria-invalid={!!validationErrors.name}
              aria-describedby={validationErrors.name ? "name-error" : undefined}
            />
            {validationErrors.name && (
              <p id="name-error" className="mt-1 text-sm text-red-600">
                {validationErrors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none ${
                validationErrors.email 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              aria-invalid={!!validationErrors.email}
              aria-describedby={validationErrors.email ? "email-error" : undefined}
            />
            {validationErrors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600">
                {validationErrors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number (optional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(555) 555-5555"
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none ${
                validationErrors.phone 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              aria-invalid={!!validationErrors.phone}
              aria-describedby={validationErrors.phone ? "phone-error" : undefined}
            />
            {validationErrors.phone && (
              <p id="phone-error" className="mt-1 text-sm text-red-600">
                {validationErrors.phone}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message*
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none ${
                validationErrors.message 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              aria-invalid={!!validationErrors.message}
              aria-describedby={validationErrors.message ? "message-error" : undefined}
            />
            <div className="flex justify-between mt-1">
              {validationErrors.message && (
                <p id="message-error" className="text-sm text-red-600">
                  {validationErrors.message}
                </p>
              )}
              <p className={`text-sm ${remainingChars < 50 ? 'text-red-600' : 'text-gray-500'}`}>
                {remainingChars} characters remaining
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={status === 'loading' || timeLeft > 0 || Object.keys(validationErrors).length > 0}
              className={`flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                (status === 'loading' || timeLeft > 0 || Object.keys(validationErrors).length > 0) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }`}
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
            
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Reset Form
            </button>
          </div>
        </form>

        {showSaveIndicator && (
          <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg transition-opacity">
            Form progress saved
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactForm;