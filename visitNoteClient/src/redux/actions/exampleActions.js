// src/actions/exampleActions.js
const masterTemplateInsertionType = "Master_Final_Template";
const templateInsertion = (obj) => {
  const { _id, payload } = obj;
  let dispatcherType = "";
  switch (_id) {
    case "Subjective":
      dispatcherType = "Subjective_final_Template";
      break;
    case "Objective":
      dispatcherType = "Objective_final_Template";
      break;
    case "Assessment":
      dispatcherType = "Assessment_final_Template";
      break;
    case "Plan":
      dispatcherType = "Plan_final_Template";
  }
  return {
    type: dispatcherType,
    payload: {
      _id,
      finalTemp: payload,
    },
  };
};

const masterTemplateInsertion = (obj) => {
  return {
    type: masterTemplateInsertionType,
    payload: obj.payload,
  };
};

export { templateInsertion, masterTemplateInsertion };
