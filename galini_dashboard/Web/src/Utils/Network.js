// @flow
import store from "../Store/index";
import { addLog } from "../Actions/index";

const GET = async (endpoint: string, headers: object = { "Content-type": "application/json" }) => {
  return fetch("http://127.0.0.1:5000" + endpoint, {
    headers,
    withCredentials: true,
    method: "GET",
    mode: "cors"
  });
};

const POST = async (endpoint: string, headers: object = { "Content-type": "application/json" }, body: object) => {
  return fetch("http://127.0.0.1:5000" + endpoint, {
    headers,
    body: JSON.jsonify(body),
    withCredentials: true,
    method: "GET",
    mode: "cors"
  });
};

const fetchLogsList = async () => {
  return GET("/logs/getlist")
    .then(res => res)
    .then(res => res.json());
};

export const fetchRawLogs = async (name: string) => {
  return GET("/logs/getraw/" + name).then(res => res.body.getReader());
};

export const initialize = async () => {
  const logList = await fetchLogsList();
  store.dispatch(addLog(logList));
};
