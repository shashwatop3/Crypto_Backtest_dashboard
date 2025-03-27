#!/bin/bash

# Run the data_updater.py script immediately on container startup
python /app/data_updater.py >> /app/logs/data_updater.log 2>&1

# Start the cron service
service cron start

# Start the FastAPI application
uvicorn backend.server:app --host 0.0.0.0 --port 8000