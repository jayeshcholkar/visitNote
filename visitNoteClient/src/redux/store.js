// store.js
// import { applyMiddleware } from "redux";
import { configureStore } from "@reduxjs/toolkit";
// import { thunk } from "redux-thunk";
import rootReducer from "./reducers"; // Create this file to combine your reducers

const store = configureStore({
  reducer: rootReducer,
});

export default store;
