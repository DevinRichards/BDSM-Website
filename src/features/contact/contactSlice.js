import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Throttling configuration
const THROTTLE_LIMIT = 3; // Maximum submissions allowed
const THROTTLE_PERIOD = 1800000; // 30 minutes in milliseconds
const THROTTLE_KEY = 'contactFormSubmissions';

// Load persisted form data from localStorage
const loadPersistedForm = () => {
  try {
    const persistedData = localStorage.getItem('contactFormData');
    return persistedData ? JSON.parse(persistedData) : null;
  } catch (error) {
    console.error('Error loading persisted form:', error);
    return null;
  }
};

// Check if user has exceeded submission limit
const checkThrottling = () => {
  try {
    const submissions = JSON.parse(localStorage.getItem(THROTTLE_KEY) || '[]');
    const now = Date.now();
    
    // Remove expired entries
    const recentSubmissions = submissions.filter(
      timestamp => now - timestamp < THROTTLE_PERIOD
    );
    
    // Update localStorage with cleaned data
    localStorage.setItem(THROTTLE_KEY, JSON.stringify(recentSubmissions));
    
    return recentSubmissions.length >= THROTTLE_LIMIT;
  } catch (error) {
    console.error('Error checking throttle:', error);
    return false;
  }
};

// Record new submission timestamp
const recordSubmission = () => {
  try {
    const submissions = JSON.parse(localStorage.getItem(THROTTLE_KEY) || '[]');
    submissions.push(Date.now());
    localStorage.setItem(THROTTLE_KEY, JSON.stringify(submissions));
  } catch (error) {
    console.error('Error recording submission:', error);
  }
};

// Get time until next allowed submission
export const getTimeUntilNextSubmission = () => {
  try {
    const submissions = JSON.parse(localStorage.getItem(THROTTLE_KEY) || '[]');
    if (submissions.length === 0) return 0;
    
    const oldestSubmission = Math.min(...submissions);
    const timeLeft = THROTTLE_PERIOD - (Date.now() - oldestSubmission);
    return Math.max(0, timeLeft);
  } catch (error) {
    console.error('Error calculating next submission time:', error);
    return 0;
  }
};

const initialState = {
  formData: loadPersistedForm() || {
    name: '',
    email: '',
    phone: '',
    message: '',
  },
  status: 'idle',
  error: null,
  submissions: [],
};

export const submitContactForm = createAsyncThunk(
  'contact/submitForm',
  async (formData, { rejectWithValue }) => {
    // Check throttling before submission
    if (checkThrottling()) {
      const timeLeft = getTimeUntilNextSubmission();
      const minutesLeft = Math.ceil(timeLeft / 60000);
      return rejectWithValue(
        `Please wait ${minutesLeft} minutes before submitting another message.`
      );
    }

    try {
      // Simulate API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, data: formData });
        }, 1000);
      });
      
      // Record successful submission
      recordSubmission();
      localStorage.removeItem('contactFormData');
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
      // Persist to localStorage
      localStorage.setItem('contactFormData', JSON.stringify(state.formData));
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('contactFormData');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContactForm.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitContactForm.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions.push(action.payload.data);
        state.formData = initialState.formData;
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { updateFormData, resetForm } = contactSlice.actions;
export default contactSlice.reducer;