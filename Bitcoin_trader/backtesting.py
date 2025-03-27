from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
        mse = mean_squared_error(y_test, y_pred)
        rmse = np.sqrt(mse)
        mae = mean_absolute_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        print(f"\nRegression Metrics for Regime {regime}:")
        print(f"MSE: {mse:.4f}")
        print(f"RMSE: {rmse:.4f}")
        print(f"MAE: {mae:.4f}")
        print(f"R²: {r2:.4f}")
        
        # Calculate directional accuracy
        direction_actual = np.sign(y_test)
        direction_pred = np.sign(y_pred)
        directional_accuracy = np.mean(direction_actual == direction_pred)
        
        print(f"\nDirectional Accuracy: {directional_accuracy:.4f}")
        
        # Create a classification from regression predictions
        threshold = 100  # Threshold for signal generation
        y_test_class = np.where(y_test > threshold, 1, np.where(y_test < -threshold, -1, 0))
        y_pred_class = np.where(y_pred > threshold, 1, np.where(y_pred < -threshold, -1, 0))
        
        # Calculate classification metrics
        from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
        accuracy = accuracy_score(y_test_class, y_pred_class)
        
        print(f"\nClassification Metrics (using threshold = {threshold}):")
        print(f"Accuracy: {accuracy:.4f}")
        print("\nClassification Report:")
        print(classification_report(y_test_class, y_pred_class))
        print("\nConfusion Matrix:")
        print(confusion_matrix(y_test_class, y_pred_class))
        
        # Basic backtesting
        print("\n--- Basic Backtesting ---")
        
        # Create a DataFrame for backtesting
        backtest_df = pd.DataFrame({
            'actual': y_test,
            'predicted': y_pred,
            'close': X_test['close'].values
        })
        
        # Generate trading signals based on predictions
        backtest_df['signal'] = np.where(backtest_df['predicted'] > threshold, 1, 
                                         np.where(backtest_df['predicted'] < -threshold, -1, 0))
        
        # Calculate returns
        backtest_df['returns'] = backtest_df['close'].pct_change().fillna(0)
        
        # Calculate strategy returns (signal * next period return)
        backtest_df['strategy_returns'] = backtest_df['signal'].shift(1) * backtest_df['returns']
        backtest_df['strategy_returns'] = backtest_df['strategy_returns'].fillna(0)
        
        # Calculate cumulative returns
        backtest_df['cumulative_market_returns'] = (1 + backtest_df['returns']).cumprod() - 1
        backtest_df['cumulative_strategy_returns'] = (1 + backtest_df['strategy_returns']).cumprod() - 1
        
        # Calculate performance metrics
        total_return = backtest_df['cumulative_strategy_returns'].iloc[-1]
        market_return = backtest_df['cumulative_market_returns'].iloc[-1]
        
        # Sharpe ratio (annualized, assuming daily returns)
        sharpe_ratio = backtest_df['strategy_returns'].mean() / backtest_df['strategy_returns'].std() * np.sqrt(252)
        
        # Maximum drawdown
        cumulative_returns = (1 + backtest_df['strategy_returns']).cumprod()
        running_max = np.maximum.accumulate(cumulative_returns)
        drawdowns = (cumulative_returns / running_max) - 1
        max_drawdown = drawdowns.min()
        
        print(f"Total Return: {total_return:.4f}")
        print(f"Market Return: {market_return:.4f}")
        print(f"Sharpe Ratio: {sharpe_ratio:.4f}")
        print(f"Maximum Drawdown: {max_drawdown:.4f}")
        
        # Plot performance
        plt.figure(figsize=(12, 8))
        
        plt.subplot(2, 1, 1)
        plt.plot(backtest_df['cumulative_market_returns'], label='Market')
        plt.plot(backtest_df['cumulative_strategy_returns'], label='Strategy')
        plt.title(f'Regime {regime} - Cumulative Returns')
        plt.legend()
        
        plt.subplot(2, 1, 2)
        plt.bar(range(len(backtest_df)), backtest_df['strategy_returns'], label='Strategy Returns')
        plt.title('Strategy Daily Returns')
        
        plt.tight_layout()
        plt.savefig(f'../graphs/visuals/backtest_regime_{regime}.png')
        plt.show()

    # Create a combined model for prediction
    print("\n--- Creating Combined Predictive Model ---")
    
    def predict_with_regime_models(X, regime):
        """Make predictions using the appropriate model for the given regime"""
        regime_model_info = models[regime]
        model = regime_model_info['model']
        model_type = regime_model_info['type']
        scaler = regime_model_info['scaler']
        
        if model_type == 'xgboost':
            return model.predict(X)
        elif model_type == 'lstm':
            X_scaled = scaler.transform(X)
            X_reshaped = X_scaled.reshape((X_scaled.shape[0], 1, X_scaled.shape[1]))
            return model.predict(X_reshaped).flatten()
        else:
            raise ValueError(f"Unknown model type: {model_type}")
    
    # Example of how to use the combined model for prediction
    # First, get the regime for new data
    # Then, use the appropriate model for that regime
    
    print("Example of combined model prediction (using test data):")
    
    # Get a sample of test data
    test_sample = df_with_regimes.sample(5)
    print("\nSample data:")
    print(test_sample[['close', 'regime', target]].head())
    
    # Make predictions
    for idx, row in test_sample.iterrows():
        regime = int(row['regime'])
        X_sample = row[features].values.reshape(1, -1)
        prediction = predict_with_regime_models(X_sample, regime)
        print(f"Sample {idx}, Regime {regime}, Actual: {row[target]:.4f}, Predicted: {prediction[0]:.4f}")