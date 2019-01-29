// @flow

import { createStore } from "redux";
import { actionTypes } from "../Actions/index";

const reducer = (state = { logsList: [], logs: {} }, action) => {
  if (action.type === actionTypes.ADD_LOG) {
    return Object.assign({}, state, {
      logsList: state.logsList.concat(action.payload)
    });
  }
  return state;
};

const store = createStore(reducer);

export default store;
