import os
from galini_io.reader import MessageReader
from google.protobuf.json_format import MessageToJson

class Connection:

    def __init__(self, staticPath, textReadLimit = 100):
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
        while msg is not None:
            if msg.HasField("text"):
                text.append(msg.text.content)
            msg = reader.read_next()
        return ''.join(text)

    def readState(self, fileName):
        self.stateContent = self._getContent(fileName, self.stateContent)
        jsonObjects = []
        reader = MessageReader(self.stateContent)
        for msg in reader:
            if msg.HasField("solve_start") or msg.HasField("solve_end") or msg.HasField("update_variable"):
                jsonObjects.append(MessageToJson(msg))
        return jsonObjects