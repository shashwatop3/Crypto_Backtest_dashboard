from typing import List, Dict, Any
from fastapi import FastAPI
import joblib
import pandas as pd
import numpy as np
from positions import Positions
from order_class import BuyOrder, SellOrder
from backend_preprocessing import dataPipeline
from sklearn.preprocessing import StandardScaler
from pydantic import BaseModel
import logging
import requests
from fastapi import Query
from fastapi.middleware.cors import CORSMiddleware


# Define the DataPoint class
class DataPoint(BaseModel):
    Open_time: str
    Open: float
    High: float
    Low: float
    Close: float
    Volume: float


class BacktestPayload(BaseModel):
    prices: List[float]
    signals: List[int]
    stop_loss: float
    take_profit: float
    intial_capital: float
    Quantity: float
    last_n: int

class BacktestResult(BaseModel):
    capital_history: List[float]
    evals: Dict[str, Any]
    buy_signals: List[int]
    sell_signals: List[int]
    prices: List[float]
    


model = joblib.load('/app/models/xgboost_model.joblib')

logging.basicConfig(level=logging.INFO)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

@app.get("/")
def check_route():
    return {"message": "Hello, welcome to the API!"}

@app.get("/recent_data")
def get_recent_data():
    df = pd.read_csv('/app/data/btc_15m_data_2018_to_2025.csv')

    data = df.tail(100)

    data_json = data.reset_index().to_dict(orient='records')
    return data_json

@app.post("/predict")
def predict(data: List[DataPoint]):

    df = pd.DataFrame([item.dict() for item in data])
    print("Before preprocessing:", df.head()) 

    processed_data = dataPipeline(df)


    if "Open_time" in processed_data.columns:
        dates = processed_data["Open_time"]
        processed_data = processed_data.drop(columns=["Open_time"])
    
    print("After preprocessing:", processed_data.head())  


    predictions = model.predict(processed_data)
    
    print("Predictions:", predictions)
    return {
        "predictions": predictions.tolist(),
        "processed_data": processed_data.to_dict(orient="records"),
        "dates": dates.tolist()

    }
@app.post("/backtest")
def backtest(payload: BacktestPayload):
    # Extract parameters from the payload
    prices = payload.prices
    signals = payload.signals
    stop_loss = payload.stop_loss
    take_profit = payload.take_profit
    initial_capital = payload.intial_capital
    quantity = payload.Quantity
    last_n = payload.last_n


    capital_history = [initial_capital]
    closed_positions = []

    
    positions = Positions(initial_capital)
    
    for i, (price, signal) in enumerate(zip(prices, signals)):

        positions.check_positions(price)
        
        try:
            if signal == 0: 
                buy_order = BuyOrder(entry_price=price, quantity=quantity, stoploss=stop_loss, takeprofit=take_profit)
                positions.add_position(buy_order)
            elif signal == 2: 
                sell_order = SellOrder(entry_price=price, quantity=quantity, stoploss=stop_loss, takeprofit=take_profit)
                positions.add_position(sell_order)
        except ValueError as e:
            logging.warning(f"Skipping position at index {i} due to error: {e}")
            continue


        capital_history.append(positions.get_current_capital())

    # positions.close_all_positions(prices[-1])
    capital_history.append(positions.get_current_capital())
    closed_positions = positions.get_closed_positions()
    open_positions = positions.get_positions()

    total_trades = positions.get_profit_count() + positions.get_loss_count()
    win_rate = positions.get_success_rate()
    profit_loss = positions.get_profit_loss()
    final_capital = positions.get_current_capital()
    total_return = (final_capital - initial_capital) / initial_capital * 100

    evals = {
        "Total Trades": total_trades,
        "Win Rate (%)": f"{win_rate:.2f}",
        "Profit/Loss": f"${profit_loss:.2f}",
        "Initial Capital": f"${initial_capital:,.2f}",
        "Final Capital": f"${final_capital:,.2f}",
        "Return (%)": f"{total_return:.2f}%",
        "Closed Positions": closed_positions,
        "Open Positions": open_positions
    }
    
    price_array = prices.values if isinstance(prices, pd.Series) else np.array(prices)
    signal_array = np.array(signals)

    buy_signals = np.where(signal_array == 0)[0]
    sell_signals = np.where(signal_array == 2)[0]

    results = {
        "capital_history": capital_history,
        "closed_positions": closed_positions,
        "evals": evals,
        "buy_signals": buy_signals.tolist(),
        "sell_signals": sell_signals.tolist(),
        "prices": price_array.tolist(),
        "signals": signal_array.tolist()
    }
    
    return results

@app.get("/recent_backtest")
def get_recent_backtest(days: int = Query(120, description="Number of days to include in the backtest"),
                        stop_loss: float = Query(0.002, description="Stop loss percentage"),
                        take_profit: float = Query(0.006, description="Take profit percentage"),
                        intial_capital: float = Query(100000, description="Initial capital amount"),
                        Quantity: float = Query(0.1, description="Quantity to buy/sell")):
    
    df = pd.read_csv('/app/data/btc_15m_data_2018_to_2025.csv')
    data = df.tail(96 * (days + 50))
    data.drop(columns=['Close time', 'Quote asset volume', 'Number of trades', 'Taker buy base asset volume', 'Taker buy quote asset volume', 'Ignore'], inplace=True)
    data.rename(columns={
        "Open time": "Open_time",
        "Open": "Open",
        "High": "High",
        "Low": "Low",
        "Close": "Close",
        "Volume": "Volume"
    }, inplace=True)

    payload = data.to_dict(orient="records")
    url = "http://localhost:8000/predict"

    response = requests.post(url, json=payload)

    if response.status_code != 200:
        raise ValueError(f"Error from /predict endpoint: {response.text}")
    signals = response.json()['predictions']
    data = pd.DataFrame(response.json()['processed_data'])
    stop_loss = stop_loss
    take_profit = take_profit
    initial_capital = intial_capital
    quantity = Quantity
    last_n = days * 96

    dates = response.json()['dates']


    back_test_url = "http://localhost:8000/backtest"
    back_test_payload = {
        "prices": data['Close'].values.tolist(),
        "signals": signals,
        "stop_loss": stop_loss,
        "take_profit": take_profit,
        "intial_capital": initial_capital,
        "Quantity": quantity,
        "last_n": last_n
    }

    # logging.info(f"Backtest Payload: {back_test_payload}")

    backtest_res = requests.post(back_test_url, json=back_test_payload)

    if backtest_res.status_code != 200:
        raise ValueError(f"Error from /backtest endpoint: {backtest_res.text}")
    # print("Backtest Response:", backtest_res.json())

    ret =  backtest_res.json()
    ret['dates'] = dates
    return ret