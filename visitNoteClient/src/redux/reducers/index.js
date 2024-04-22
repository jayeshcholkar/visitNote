// src/reducers/index.js
import { combineReducers } from 'redux';
// Import your individual reducers
import { sectionTemplateReducer } from './exampleReducer';

const rootReducer = combineReducers({
  // Add your reducers here
  finalTemp: sectionTemplateReducer,
});

export default rootReducer;
