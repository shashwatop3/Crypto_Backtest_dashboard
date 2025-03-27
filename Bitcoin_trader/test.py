import pandas as pd
import requests

# Read the CSV file
df = pd.read_csv('data/btc_15m_data_2018_to_2025.csv')
df.drop(columns=['Close time', 'Quote asset volume', 'Number of trades', 'Taker buy base asset volume', 'Taker buy quote asset volume', 'Ignore'], inplace=True)
df.rename(columns={
    "Open time": "Open_time",
    "Open": "Open",
    "High": "High",
    "Low": "Low",
    "Close": "Close",
    "Volume": "Volume"
}, inplace=True)


data = df.tail(500)

payload = data.to_dict(orient="records")  

url = "http://localhost:8000/predict"

# Send the POST request with the JSON data
response = requests.post(url, json=payload)


print("Status Code:", response.status_code)
# print("Response Text:", response.text)

signals = response.json()['predictions']
price = data['Close'].values[-1]
stop_loss = 0.002
take_profit = 0.006
intial_capital = 100000
quantity = 0.1
last_n = 100

back_test_url = "http://localhost:8000/backtest"

back_test_payload = {
    "prices": data['Close'].values.tolist(),
    "signals": signals,
    "stop_loss": stop_loss,
    "take_profit": take_profit,
    "initial_capital": intial_capital,
    "quantity": quantity,
    "last_n": last_n
}

backtest_res = requests.post(back_test_url, json=back_test_payload)

print("Status Code:", backtest_res.status_code)
print("Backtest Response:", backtest_res.json())
