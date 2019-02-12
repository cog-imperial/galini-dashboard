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

import uuid
import os
from galini_dashboard.API.Connection import Connection

class ConnectionManager:

    class __ConnectionManager:
        
        def __init__(self, staticPath):
            self.connections = dict()
            if not os.path.isdir(staticPath):
                raise NotADirectoryError(staticPath + " : is not a valid path")
            self.staticPath = staticPath
            
    instance = None
    def __init__(self, staticPath):
        if ConnectionManager.instance is None:
            ConnectionManager.instance = ConnectionManager.__ConnectionManager(staticPath)
        
    def establishNewConnection(self):
        userId = uuid.uuid4()
        self.instance.connections[str(userId)] = Connection(self.instance.staticPath)
        return str(userId)

    def getConnection(self, id):
        if id not in self.instance.connections:
            return None
        return self.instance.connections[id]