export const actionTypes = {
  ADD_LOG: "ADD_LOG",
  ADD_SOLVER_LOG: "ADD_SOLVER_LOG",
  ADD_SOLVER_EVENT: "ADD_SOLVER_EVENT",
  CLEAR_SOLVER_EVENT: "CLEAR_SOLVER_EVENT",
  SET_MODULES_HEIGHT: "SET_MODULES_HEIGHT"
};

export const addLog = payload => {
  return { type: actionTypes.ADD_LOG, payload };
};

export const addSolverEvent = payload => {
  return { type: actionTypes.ADD_SOLVER_EVENT, payload };
};

export const addSolverLog = payload => {
  return { type: actionTypes.ADD_SOLVER_LOG, payload };
};

export const clearSolverEvent = () => {
  return { type: actionTypes.CLEAR_SOLVER_EVENT, payload: {} };
};

export const setModulesHeight = payload => {
  return { type: actionTypes.SET_MODULES_HEIGHT, payload };
};
