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
from collections import Counter
from itertools import takewhile
from galini_io.reader import MessageReader
from google.protobuf.json_format import MessageToJson
import h5py
import json

class Node:

    def __init__(self, pos):
        self.pos = pos
        self.lower = None
        self.upper = None
        self.counts = None
        self.freq = None

    def setLower(self, lower):
        self.lower = lower

    def setUpper(self, upper):
        self.upper = upper

    def getBounds(self):
        return list(zip(self.lower, self.upper))

    def getCountsFreq(self):
        return (self.counts, self.freq)

    def calculateCounts(self):
        assert len(self.lower) == len(self.upper)
        self.counts = Counter(self.getBounds())
        self.freq = [0] * len(self.lower)
      #  print(self.counts)
        for (val, count) in self.counts.most_common():
            self.freq[count - 1] += 1
      #  print(self.freq)
        self.freq = "-".join(str(x) for x in self.freq)

    def getValues(self):
        return np.append(self.lower, self.upper)

    def __str__(self):
        return self.pos + "\n" + str(self.lower) + "\n" + str(self.upper) + "\n"

def findSymmetry(nodes):
    bounds = list(map(lambda x: x.getBounds(), nodes))
    matches = [all(bound[i] == bounds[0][i] for bound in bounds) for i in range(len(bounds[0]))]
    possibilities = []
    for i in range(len(matches)):
        if not matches[i]:
            possibilities.append([bound[i] for bound in bounds])
    print(matches)
    for row in zip(*possibilities):
        print(row)

dic = dict()
filename = "pointpack04"

f = open(os.path.join(filename, "messages.bin"), "rb")
reader = MessageReader(f)
h5data = h5py.File(os.path.join(filename, "data.hdf5"), "r")
for msg in reader:
    if msg.HasField("tensor"):
        msg_json = MessageToJson(msg)
        data = h5data[msg.tensor.group_]
        json_obj = json.loads(msg_json)
        d = list(data[msg.tensor.dataset])
        pos = json_obj['tensor']['group'].split('/')[-1]
        ds = json_obj['tensor']['dataset']
        if not ds == "solution":
            if not pos in dic: 
               # print(pos)
                dic[pos] = Node(pos)
            if ds == "lower_bounds":
                dic[pos].setLower(d)
            elif ds == "upper_bounds":
                dic[pos].setUpper(d)
h5data.close()
f.close()

#dic contains a map from position -> node object

m = dict()

for key, value in dic.items():
    value.calculateCounts()
    (counts, freq) = value.getCountsFreq()
    if not freq in m:
        m[freq] = []
    m[freq].append(value)

# freq = histogram in string form
# m = map from freq to a list of nodes with matching freq 

# now it finds 

for key, value in m.items():
    # value is a list of nodes
    if len(value) > 1:
        eq = Counter([str(x.getCountsFreq()[0].most_common()) for x in value]).most_common()
        # eq contains all the different permutations of the lower,upper bound pairs
        commons = [x[0] for x in list(takewhile(lambda x : x[1] > 1, eq))]
        # commons finds all that have value > 1, meaning is symmetry
        matches = dict()
        for s in commons:
            matches[s] = []
            for v in value:
                if str(v.getCountsFreq()[0].most_common()) == s:
                    matches[s].append(v)
        for k, v in matches.items():
            findSymmetry(v)
            print("\n\n")
            for va in v:
                print(va)