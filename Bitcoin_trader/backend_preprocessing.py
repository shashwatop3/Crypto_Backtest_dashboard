#!/usr/bin/env python
# coding: utf-8


from sklearn.preprocessing import LabelBinarizer, LabelEncoder
import pandas as pd
import numpy as np
import pandas_ta as ta
import logging
logging.basicConfig(level=logging.INFO)

def dataPipeline(df):
    # logging.info(f"Input DataFrame: {df.head()}")
    #convert Open_time to datetime format
    if 'Open_time' not in df.columns:
        raise KeyError("The column 'Open_time' is missing from the DataFrame.")

    df['Open_time'] = pd.to_datetime(df['Open_time'])
    df.set_index('Open_time', inplace=True)
    # Select and preprocess required columns
    df.ta.sma(length=50, append=True)
    df.ta.ema(length=50, append=True)
    df.ta.wma(length=50, append=True)
    df.ta.macd(fast=12, slow=26, append=True)
    df.ta.rsi(length=14, append=True)
    df.ta.bbands(length=20, append=True)
    df.ta.adx(length=14, append=True)
    df.ta.stoch(length=14, append=True)
    df.ta.willr(length=14, append=True)
    df.ta.roc(length=10, append=True)
    df.ta.cci(length=20, append=True)
    df.ta.atr(length=14, append=True)
    df.ta.tsi(length=25, append=True)       # True Strength Index     
    df.ta.ichimoku(append=True)             # Ichimoku Cloud                # Parabolic SAR
    df.ta.obv(append=True)                  # On-Balance Volume
    df.ta.vwap(append=True)                 # Volume Weighted Average Price
    df.ta.donchian(length=20, append=True)  # Donchian Channels
    df.ta.ema(length=10, append=True)  
    df.drop(columns=['ISB_26'])



    df.drop(['Open', 'High', 'Low'], axis=1, inplace=True)
    df.dropna(inplace=True)
    df.reset_index(inplace=True)
    X = df
    return X



