// @flow
import store from "../Store/index";
import { addLog, addSolverLog, clearSolverEvent, addSolverEvent } from "../Actions/index";
import JSONStreamParser from "./JSONStreamParser";

const flaskEndpoint = "http://127.0.0.1:5000";

const GET = async (endpoint: string, headers: object = { "Content-type": "application/json" }) => {
  return fetch(flaskEndpoint + endpoint, {
    headers,
    withCredentials: true,
    method: "GET",
    mode: "cors"
  });
};

const POST = async (endpoint: string, headers: object = { "Content-type": "application/json" }, body: object) => {
  return fetch(flaskEndpoint + endpoint, {
    headers,
    body: JSON.jsonify(body),
    withCredentials: true,
    method: "GET",
    mode: "cors"
  });
};

const processLogs = (reader: ReadableStreamDefaultReader, parser: JSONStreamParser) => {
  reader.read().then(({ done, value }) => {
    if (!done) {
      const items = parser.parse(new TextDecoder("utf-8").decode(value));
      items.forEach((item, val) => {
        store.dispatch(item.text ? addSolverLog(item.text) : addSolverEvent(item));
      });
      return processLogs(reader, parser);
    }
  });
};

export const fetchRawLogs = async (name: string) => {
  store.dispatch(clearSolverEvent());
  const reader = await GET("/logs/getraw/" + name)
    .then(res => res)
    .then(res => res.body.getReader());
  processLogs(reader, new JSONStreamParser());
};

export const initialize = async () => {
  const logList = await GET("/logs/getlist")
    .then(res => res)
    .then(res => res.json());
  store.dispatch(addLog(logList));
};
