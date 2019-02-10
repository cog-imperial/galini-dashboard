# Copyright 2018 Nicholas Li
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from flask import Blueprint, Response, jsonify, request, abort 
import json
import os
import time
from galini_io.reader import MessageReader
from galini_dashboard.API.ConnectionManager import ConnectionManager

manager = ConnectionManager("Static/run_logs")

static_path = "Static/run_logs"  # TODO: Fix there's probably a better way..
logs_endpoint = Blueprint("logs_endpoint", __name__, static_folder=static_path)

@logs_endpoint.route("/init")
def get():
    return manager.establishNewConnection()


@logs_endpoint.route("/getraw/<name>", methods=["GET"])
def getRaw(name):
    def stream():
        content = open(static_path + "/" + name + "/messages.bin", "rb")
        msg_reader = MessageReader(content)
        for msg in msg_reader:
            if msg.HasField("text"):
                yield json.dumps({"text": msg.text.content})
            if msg.HasField("update_variable"):
                yield json.dumps(
                    {
                        "type": "update",
                        "name": msg.update_variable.name,
                        "iteration": msg.update_variable.iteration,
                        "value": msg.update_variable.value,
                    }
                )

    return Response(stream(), mimetype="text/plain")


@logs_endpoint.route("/getlist", methods=["GET"])
def getList():
    directories = os.listdir(static_path)
    arr = []
    for name in directories:
        arr.append(name)
    return json.dumps(arr)

@logs_endpoint.route("/gettext", methods=["POST"])
def getText():
    body = request.get_json()
    con = getConnection(body['id'])
    filename = body['filename']
    try:
        return con.readText(filename)
    except FileNotFoundError:
        abort(400) # File not found

@logs_endpoint.route("/getstate", methods=["POST"])
def getState():
    body = request.get_json()
    con = getConnection(body['id'])
    filename = body['filename']
    try:
        return json.dumps(con.readState(filename))
    except FileNotFoundError:
        abort(400) # File not found
        
def getConnection(uuid):
    con = manager.getConnection(uuid)
    if con is None:
        abort(400) # User id not found
    return con