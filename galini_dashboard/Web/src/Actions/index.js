export const actionTypes = {
  ADD_LOG: "ADD_LOG"
};

export const addLog = payload => {
  return { type: actionTypes.ADD_LOG, payload };
};
