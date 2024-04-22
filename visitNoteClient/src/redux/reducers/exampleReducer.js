// src/reducers/exampleReducer.js
const initialState = {
  // Define your initial state here
  data: {
    Subjective: { templateData: [] },
    Objective: { templateData: [] },
    Assessment: { templateData: [] },
    Plan: { templateData: [] },
  },
};

export const sectionTemplateReducer = (state = initialState, action) => {
  switch (action.type) {
    // Define your action types and corresponding logic here
    case "Subjective_final_Template":
    case "Objective_final_Template":
    case "Assessment_final_Template":
    case "Plan_final_Template":
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload._id]: { templateData: action.payload.finalTemp },
        },
      };
    case "Master_Final_Template":
      return {
        ...state,
        data:{
          ...state.data,
          ...action.payload
        }
      }
    default:
      return state;
  }
};
