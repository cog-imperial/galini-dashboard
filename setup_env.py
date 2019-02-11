import sys
import os
import subprocess

if len(sys.argv) == 1:
    print("Pass in path to python 3.6 executable as first argument")
    exit(-1)

path = sys.argv[1]

if not os.path.isfile(path):
    print("Invalid path")
    exit(-1)

os.system("pip install virtualenv")
os.system("virtualenv -p " + path + " venv")
dirname = os.path.dirname(__file__)
activatePath = os.path.join(dirname, "venv", "Scripts")
os.chdir(activatePath)
os.system("activate")
os.system("pip install flask")
os.system("pip install galini-io")
os.system("pip install -e .")

