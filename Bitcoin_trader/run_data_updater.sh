#!/bin/bash

# Debugging: Log the current environment
echo "Running at $(date)" >> /app/logs/debug.log
echo "PATH: $PATH" >> /app/logs/debug.log
echo "Python path: $(which python3)" >> /app/logs/debug.log
echo "Python version: $(/usr/local/bin/python3 --version)" >> /app/logs/debug.log

# Run the Python script
/usr/local/bin/python3 /app/data_updater.py >> /app/logs/data_updater.log 2>&1