// @flow

import { createStore } from "redux";
import { actionTypes } from "../Actions/index";

const reducer = (state = { logsList: [], rawLogs: [], solverEvents: [], modulesHeight: 0 }, action) => {
  if (action.type === actionTypes.ADD_LOG) {
    return Object.assign({}, state, {
      logsList: state.logsList.concat(action.payload)
    });
  }
  if (action.type === actionTypes.ADD_SOLVER_LOG) {
    return Object.assign({}, state, {
      rawLogs: state.rawLogs.concat(action.payload)
    });
  }
  if (action.type === actionTypes.ADD_SOLVER_EVENT) {
    return Object.assign({}, state, {
      solverEvents: state.solverEvents.concat(action.payload)
    });
  }
  if (action.type === actionTypes.CLEAR_SOLVER_EVENT) {
    return { logsList: state.logsList, rawLogs: [], solverEvents: [] };
  }
  if (action.type === actionTypes.SET_MODULES_HEIGHT) {
    return { ...state, modulesHeight: action.payload };
  }
  return state;
};

const store = createStore(reducer);

export default store;
