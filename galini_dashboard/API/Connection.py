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

import os
from galini_io.reader import MessageReader
from google.protobuf.json_format import MessageToJson
import h5py
import numpy as np
import json


class Connection:
    def __init__(self, staticPath, textReadLimit=100):
        self.staticPath = staticPath
        self.textReadLimit = textReadLimit
        self.textContent = None
        self.stateContent = None

    def _openFile(self, fileName):
        return open(os.path.join(self.staticPath, fileName, "messages.bin"), "rb")

    def _getContent(self, fileName, content):
        if content is None:
            content = self._openFile(fileName)
        else:
            currentFile = content.name
            if not currentFile.endswith(fileName + "\messages.bin"):
                content.close()
                content = self._openFile(fileName)
        return content

    def readText(self, fileName):
        self.textContent = self._getContent(fileName, self.textContent)
        text = []
        reader = MessageReader(self.textContent)
        msg = reader.read_next()
        while msg is not None and len(text) < self.textReadLimit:
            if msg.HasField("text"):
                content = msg.text.content
                if content[-1] != "\n":
                    content += "\n"
                text.append(content)
            msg = reader.read_next()
        return "".join(text)

    def _openH5Data(self, fileName, data):
        if data is None:
            data = h5py.File(os.path.join(self.staticPath, fileName, "data.hdf5"), "r")
        return data

    def readState(self, fileName):
        self.stateContent = self._getContent(fileName, self.stateContent)
        jsonObjects = []
        reader = MessageReader(self.stateContent)
        h5data = None
        for msg in reader:
            if not msg.HasField("text"):
                msg_json = MessageToJson(msg)
                if msg.HasField("tensor"):
                    h5data = self._openH5Data(fileName, h5data)
                    data = h5data[msg.tensor.group_]
                    json_obj = json.loads(msg_json)
                    tensor = np.copy(data[msg.tensor.dataset])
                    tensor[np.isinf(tensor)] = np.sign(tensor[np.isinf(tensor)]) * 2e10
                    json_obj["hdf5"] = list(tensor)
                    msg_json = json.dumps(json_obj)
                jsonObjects.append(msg_json)
        if h5data is not None:
            h5data.close()
        return jsonObjects
