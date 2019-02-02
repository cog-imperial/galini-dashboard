#!/bin/bash
source venv/Scripts/activate
export FLASK_APP=galini_dashboard/API/server.py
flask run