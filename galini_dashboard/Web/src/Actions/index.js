export const actionTypes = {
  SET_LOGS_LIST: "SET_LOGS_LIST",
  ADD_SOLVER_LOG: "ADD_SOLVER_LOG",
  ADD_SOLVER_EVENT: "ADD_SOLVER_EVENT",
  CLEAR_SOLVER_EVENT: "CLEAR_SOLVER_EVENT",
  SET_MODULES_HEIGHT: "SET_MODULES_HEIGHT",
  ADD_SOLVER_SYMMETRY: "ADD_SOLVER_SYMMETRY"
};

export const setLogsList = payload => {
  return { type: actionTypes.SET_LOGS_LIST, payload };
};

export const addSolverEvent = payload => {
  return { type: actionTypes.ADD_SOLVER_EVENT, payload };
};

export const addSolverLog = payload => {
  return { type: actionTypes.ADD_SOLVER_LOG, payload };
};

export const addSolverSymmetry = payload => {
  return { type: actionTypes.ADD_SOLVER_SYMMETRY, payload };
};

export const clearSolverEvent = () => {
  return { type: actionTypes.CLEAR_SOLVER_EVENT, payload: {} };
};

export const setModulesHeight = payload => {
  return { type: actionTypes.SET_MODULES_HEIGHT, payload };
};
