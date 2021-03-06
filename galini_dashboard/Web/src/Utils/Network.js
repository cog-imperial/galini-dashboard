// @flow
import store from "../Store/index";
import { addSolverLog, addSolverEvent, setLogsList, addSolverSymmetry } from "../Actions/index";

const flaskEndpoint = "http://127.0.0.1:5000";
let id;

const GET = async (endpoint: string, headers: object = { "Content-type": "application/json" }) => {
  return fetch(flaskEndpoint + endpoint, {
    headers,
    withCredentials: true,
    method: "GET",
    mode: "cors"
  });
};

const POST = async (endpoint: string, body: object, headers: object = { "Content-type": "application/json" }) => {
  return fetch(flaskEndpoint + endpoint, {
    headers,
    body: JSON.stringify(body),
    withCredentials: true,
    method: "POST",
    mode: "cors"
  });
};

const getLogsList = async () => {
  const logList = await GET("/logs/getlist")
    .then(res => res)
    .then(res => res.json());
  store.dispatch(setLogsList(logList));
};

export const fetchText = async (filename: string) => {
  const text = await POST("/logs/gettext", { id, filename })
    .then(res => res)
    .then(res => res.text());
  store.dispatch(addSolverLog(text));
};

export const fetchState = async (filename: string) => {
  const states = await POST("/logs/getstate", { id, filename })
    .then(res => res)
    .then(res => res.json());
  store.dispatch(addSolverEvent(states.map(val => JSON.parse(val))));
};

export const fetchSymmetry = async (filename: string) => {
  const sym = await POST("/logs/getSymmetry", { id, filename })
    .then(res => res)
    .then(res => res.json());
  store.dispatch(addSolverSymmetry(sym));
};

export const initialize = async () => {
  id = await GET("/logs/init")
    .then(res => res)
    .then(res => res.text());
  getLogsList();
  // Update logs list every 30 seconds
  setInterval(async () => {
    getLogsList();
  }, 30000);
};
