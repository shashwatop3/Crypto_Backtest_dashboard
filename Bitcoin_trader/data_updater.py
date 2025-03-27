import os
import pandas as pd
from binance.client import Client
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
client = Client(os.getenv("BINANCE_API_KEY"), os.getenv("BINANCE_API_SECRET"))

def get_last_timestamp(existing_file):
    """Get last timestamp from existing CSV"""
    try:
        df = pd.read_csv(existing_file)
        last_date = pd.to_datetime(df['Open time']).max()
        return last_date + timedelta(minutes=15)
    except FileNotFoundError:
        print("Existing file not found, starting from 2025-01-01")
        return datetime(2025, 1, 1)

def fetch_new_data(existing_file="/app/data/btc_15m_data_2018_to_2025.csv"):
    """Main update function"""
    # Get time range
    start_date = get_last_timestamp(existing_file)
    end_date = datetime.now()
    
    # Fetch Binance data
    klines = client.get_historical_klines(
        symbol="BTCUSDT",
        interval=Client.KLINE_INTERVAL_15MINUTE,
        start_str=start_date.strftime("%Y-%m-%d %H:%M:%S"),
        end_str=end_date.strftime("%Y-%m-%d %H:%M:%S")
    )
    
    # Process new data
    columns = [
        'Open time', 'Open', 'High', 'Low', 'Close', 'Volume',
        'Close time', 'Quote asset volume', 'Number of trades',
        'Taker buy base asset volume', 'Taker buy quote asset volume', 'Ignore'
    ]
    new_data = pd.DataFrame(klines, columns=columns)
    new_data['Open time'] = pd.to_datetime(new_data['Open time'], unit='ms')
    
    if not new_data.empty:
        # Merge with existing data
        existing_data = pd.read_csv(existing_file)
        existing_data['Open time'] = pd.to_datetime(existing_data['Open time'])
        
        merged = pd.concat([existing_data, new_data]).drop_duplicates('Open time')
        merged.to_csv(existing_file, index=False)
        print(f"Updated {existing_file} with {len(new_data)} new records")
    else:
        print("No new data to update")

if __name__ == "__main__":
    fetch_new_data()
