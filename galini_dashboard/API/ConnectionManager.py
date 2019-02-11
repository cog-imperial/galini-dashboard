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