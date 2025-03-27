#!/usr/bin/env python
# coding: utf-8

# In[12]:


from sklearn.preprocessing import StandardScaler, RobustScaler, MinMaxScaler
import pandas as pd
import numpy as np
csv_file_path = "data/btc_15m_data_2018_to_2025.csv"
df = pd.read_csv(csv_file_path)

df.rename(columns={
    "Open time": "Close_time",
    "Open": "Open",
    "High": "High",
    "Low": "Low",
    "Close": "Close",
    "Volume": "Volume"
}, inplace=True)

# Prepare the data
df = df[['Close_time', 'Open', 'High', 'Low', 'Close', 'Volume']]


# Select the last 100 rows
data = df.tail(100)

# Convert the DataFrame to a list of dictionaries
data_json = data.reset_index().to_dict(orient='records')  # Include index if needed



def dataPipeline(df):
    # Ensure the required columns are present
    required_columns = ['Close_time', 'Open', 'High', 'Low', 'Close', 'Volume']
    df = pd.DataFrame(df, columns=required_columns)
    if not all(col in df.columns for col in required_columns):
        raise ValueError(f"Missing required columns. Expected: {required_columns}")


    # Select and preprocess required columns
    df = df[['Close_time', 'Open', 'High', 'Low', 'Close', 'Volume']]


    # In[15]:

    def calculate_macd(df, fast=12, slow=26, signal=9):
        df['EMA_fast'] = df['Close'].ewm(span=fast, adjust=False).mean()
        df['EMA_slow'] = df['Close'].ewm(span=slow, adjust=False).mean()
        df['MACD'] = df['EMA_fast'] - df['EMA_slow']
        df['Signal_Line'] = df['MACD'].ewm(span=signal, adjust=False).mean()
        df['MACD_Histogram'] = df['MACD'] - df['Signal_Line']
        df.drop(columns=['EMA_fast', 'EMA_slow', 'MACD', 'Signal_Line'], inplace=True)
        return df

    def bolinger_bands(df, window=20, std=2):
        df['SMA'] = df['Close'].rolling(window=window).mean()
        df['BB_up'] = df['SMA'] + (df['Close'].rolling(window=window).std() * std)
        df['BB_down'] = df['SMA'] - (df['Close'].rolling(window=window).std() * std)
        return df

    def on_balance_volume(df):
        df['OBV'] = np.where(df['Close'] > df['Close'].shift(1), df['Volume'], np.where(df['Close'] < df['Close'].shift(1), -df['Volume'], 0)).cumsum()
        return df

    def comodiity_channel_index(df, window=14):
        df['CCI'] = (df['Close'] - df['Close'].rolling(window=window).mean()) / (0.015 * df['Close'].rolling(window=window).std())
        return df

    def calculate_rsi(df, window=14):
        delta = df['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
        rs = gain / loss
        df['RSI'] = 100 - (100 / (1 + rs))
        return df


    def calculate_future_price(df, window=5):
        def weight_average(x):
            return np.dot(x, [0.33333333, 0.26666667, 0.2, 0.13333333, 0.06666667])
        df['future_price'] = df['Close'].rolling(window=window).apply(weight_average, raw=True).shift(-window)
        return df

    def adding_features(df):
        df = calculate_macd(df)
        df = bolinger_bands(df)
        df = calculate_rsi(df)
        df = on_balance_volume(df)
        df = comodiity_channel_index(df)
        df = calculate_future_price(df)
        return df
    adding_features(df)


    # In[16]:


    df['predict_trend'] = df['future_price'] - df['Close']
    df["BB_up_diff"] = df["BB_up"] - df["Close"]
    df["BB_down_diff"] = df["BB_down"] - df["Close"]
    def create_obv_zscore(df, window=20):
        df['OBV_mean'] = df['OBV'].rolling(window=window).mean()
        df['OBV_std'] = df['OBV'].rolling(window=20).std()
        df['OBV_Z'] = (df['OBV'] - df['OBV_mean']) / df['OBV_std']
        return df.drop(['OBV_mean', 'OBV_std'], axis=1)
    df = create_obv_zscore(df)
    df = df[[ 'Close_time', 'Open', 'High', 'Low' ,'Close', 'BB_up_diff', 'BB_down_diff', 'OBV_Z', 'MACD_Histogram', 'RSI', 'CCI', 'predict_trend']]


    # In[ ]:


    ## might want to remove open, close , high, low
    def final_preprocess_data(train_df):
        for col in ['Open', 'High', 'Low', 'Close']:
            train_df[f'{col}_log_return'] = np.log(train_df[col] / train_df[col].shift(1))
        
        train_df['price_mean'] = train_df[['Open', 'High', 'Low', 'Close']].mean(axis=1)
        train_df['price_std'] = train_df[['Open', 'High', 'Low', 'Close']].std(axis=1)
        train_df['price_range'] = train_df['High'] - train_df['Low']
        

        std_cols = ['MACD_Histogram', 'CCI']
        std_scaler = StandardScaler().fit(train_df[std_cols])
        train_df[std_cols] = std_scaler.transform(train_df[std_cols])
        

        train_df['RSI'] = np.clip(train_df['RSI'], 30, 70)
        rsi_scaler = MinMaxScaler(feature_range=(0, 1)).fit(train_df[['RSI']])
        train_df['RSI'] = rsi_scaler.transform(train_df[['RSI']])
        
        
        for col in ['RSI', 'MACD_Histogram', 'CCI', 'predict_trend']:
            for lag in range(1, 10):  
                train_df[f'{col}_lag_{lag}'] = train_df[col].shift(lag)
        
    
        train_df.dropna(inplace=True)
        
        return train_df

    df = final_preprocess_data(df)
    sc = StandardScaler()
    time = df['Close_time']
    df['predict_trend'] = sc.fit(df[['predict_trend']])
    # y = df['predict_trend']
    x = df.drop(columns=['predict_trend', 'Close_time'])
    # y = np.nan_to_num(y, nan=0.0, posinf=0.0, neginf=0.0)
    x = np.nan_to_num(x, nan=0.0, posinf=0.0, neginf=0.0)

    return x, time, sc
    # In[19]:


x, time, sc = dataPipeline(data_json)
print(x)
print(time)