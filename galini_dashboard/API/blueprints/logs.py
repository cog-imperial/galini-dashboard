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

from flask import Blueprint, Response, request, abort
import json
import os
import time
from galini_io.reader import MessageReader
from galini_dashboard.API.ConnectionManager import ConnectionManager

def create_logs_blueprint(static_path):
    manager = ConnectionManager(static_path)
    logs_endpoint = Blueprint("logs_endpoint", __name__, static_folder=static_path)

    @logs_endpoint.route("/init")
    def get():
        return manager.establishNewConnection()

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

    return logs_endpoint
