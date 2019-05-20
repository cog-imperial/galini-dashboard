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

## First attempt - simple attempt describing each node as an 2n-dimensional array of upper/lower bounds for each variable
## Not really successful - clustering nodes are siblings and parent-child relationships


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
    matches = [
        all(bound[i] == bounds[0][i] for bound in bounds) for i in range(len(bounds[0]))
    ]
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
        pos = json_obj["tensor"]["group"].split("/")[-1]
        ds = json_obj["tensor"]["dataset"]
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

import numpy as np
from tsne import tsne
import matplotlib.pyplot as plt


arr = None
labels = []


for key, value in dic.items():
    ar = np.array([value.getValues()])
    if arr is None:
        arr = ar
    else:
        arr = np.append(arr, ar, axis=0)
    labels.append(key)

Y = tsne(arr, 2, 18, 5)  # preplexity low = something, high (>20) = evenly distributed

fig, ax = plt.subplots()
sc = plt.scatter(Y[:, 0], Y[:, 1], 20)
c = np.random.randint(1, 5, size=Y.shape[0])
cmap = plt.cm.RdYlGn
norm = plt.Normalize(1, 4)
annot = ax.annotate(
    "",
    xy=(0, 0),
    xytext=(20, 20),
    textcoords="offset points",
    bbox=dict(boxstyle="round", fc="w"),
    arrowprops=dict(arrowstyle="->"),
)
annot.set_visible(False)


def update_annot(ind):

    pos = sc.get_offsets()[ind["ind"][0]]
    annot.xy = pos
    text = "{}".format(" ".join(labels[n] for n in ind["ind"]))
    annot.set_text(text)
    annot.get_bbox_patch().set_facecolor(cmap(norm(c[ind["ind"][0]])))
    annot.get_bbox_patch().set_alpha(0.4)


def hover(event):
    vis = annot.get_visible()
    if event.inaxes == ax:
        cont, ind = sc.contains(event)
        if cont:
            update_annot(ind)
            annot.set_visible(True)
            fig.canvas.draw_idle()
        else:
            if vis:
                annot.set_visible(False)
                fig.canvas.draw_idle()


fig.canvas.mpl_connect("motion_notify_event", hover)

plt.show()
