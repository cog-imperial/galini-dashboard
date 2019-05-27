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
import numpy as np
import json
import itertools


class Node:
    def __init__(self, pos, solution):
        self.pos = pos
        self.solution = solution

    def getSolution(self, decimals=4):
        return np.around(self.solution, decimals=decimals)

    def __str__(self):
        return self.pos + "\n" + str(self.solution) + "\n"


def readFile(filename):
    dic = dict()
    f = open(os.path.join(filename, "messages.bin"), "rb")
    reader = MessageReader(f)
    h5data = h5py.File(os.path.join(filename, "data.hdf5"), "r")
    for msg in reader:
        if msg.HasField("tensor"):
            msg_json = MessageToJson(msg)
            data = h5data[msg.tensor.group_]
            json_obj = json.loads(msg_json)
            d = list(data[msg.tensor.dataset])
            pos = json_obj["tensor"]["group"].split("/")[-1]
            ds = json_obj["tensor"]["dataset"]
            if ds == "solution":
                dic[pos] = Node(pos, d)
    h5data.close()
    f.close()
    return dic


filename = "pointpack04"
pos_to_node = readFile(filename)
dec = 4

counter_to_pos = dict()

for key, value in pos_to_node.items():
    sol = value.getSolution(dec)
    counter = str(Counter(sol))
    if counter not in counter_to_pos:
        counter_to_pos[counter] = []
    counter_to_pos[counter].append(key)


def generateMap(pair, perm):
    s = "-".join(pair)
    arr = "-".join(
        [
            str(i) + "." + ",".join(perm[i])
            for i in range(len(perm))
            if perm[i] is not None
        ]
    )
    if arr == "":
        return s
    return "-".join([s, arr])


def calculatePermutation(nodes):
    arr = []
    for pair in itertools.combinations(nodes, r=2):
        src = pos_to_node[pair[0]].getSolution(dec)
        dst = pos_to_node[pair[1]].getSolution(dec)
        assert len(src) == len(dst)
        diff = [src[i] != dst[i] for i in range(len(src))]
        perm = [None] * len(src)
        for i in range(len(src)):
            if diff[i]:
                perm[i] = [
                    str(j) for j in range(len(src)) if diff[j] and dst[j] == src[i]
                ]
        arr.append(generateMap(pair, perm))
    print(arr)
    print("--------------------------------")


# For each node, remove its children from the same list
def eliminateChildren(nodes):
    index = 0
    while index < len(nodes):
        index += 1
        prev = nodes[:index]
        # Removes all nodes that prefixes with nodes[index]
        after = [x for x in nodes[index:] if not x.startswith(nodes[index - 1])]
        if len(after) > 0:
            prev += after
        nodes = prev
    return nodes


for key, value in counter_to_pos.items():
    nodes = eliminateChildren(value)
    if len(nodes) > 1:
        calculatePermutation(nodes)

