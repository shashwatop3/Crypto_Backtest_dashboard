FROM python:3.11

# Set the working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
RUN apt-get update && apt-get install -y cron
RUN ln -s /usr/local/bin/python3 /usr/bin/python

# Copy the backend code and model file into the container
COPY ./backend /app/backend
COPY ./models/xgboost_model.joblib /app/models/xgboost_model.joblib
COPY ./backend_preprocessing.py /app/backend_preprocessing.py
COPY ./order_class.py /app/order_class.py
COPY ./positions.py /app/positions.py
COPY ./data/btc_15m_data_2018_to_2025.csv /app/data/btc_15m_data_2018_to_2025.csv
COPY ./data_updater.py /app/data_updater.py
COPY .env /app/.env
COPY run_data_updater.sh /app/run_data_updater.sh

COPY crontab.txt /etc/cron.d/data_updater_cron
RUN chmod 0644 /etc/cron.d/data_updater_cron
RUN crontab /etc/cron.d/data_updater_cron

# Ensure the data_updater.py script is executable
RUN chmod +x /app/data_updater.py
RUN chmod +x /app/run_data_updater.sh

# Create a logs directory
RUN mkdir -p /app/logs

# Copy the start script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Expose the port
EXPOSE 8000

# Use the start script as the CMD
# Use bash to run the start.sh script
CMD ["/bin/bash", "/app/start.sh"]