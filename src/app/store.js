import { configureStore } from "@reduxjs/toolkit";
import contactReducer from "../features/contact/contactSlice"

export const store = configureStore({
    reducer: {
      contact: contactReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types
          ignoredActions: ['contact/submitForm/fulfilled'],
        },
      }),
  });