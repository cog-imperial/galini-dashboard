#!/bin/bash
source venv/Scripts/activate
cd galini_dashboard/API/
export FLASK_APP=server.py
flask run