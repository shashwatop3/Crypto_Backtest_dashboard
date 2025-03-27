import pandas as pd
import numpy as np
import warnings
from statsmodels.tsa.regime_switching.markov_regression import MarkovRegression
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt


class MarkovSwitchRobust:
    def __init__(self, k_regimes=2):
        self.k = k_regimes
        self.sample_size = None  # Will store the size of the sample used
        
    def _fit_model(self, data, exog=None):
        """Fit a Markov Switching model to the data with robust error handling"""
        # Ensure data is a pandas Series
        if isinstance(data, pd.DataFrame):
            data = data['forecast_vol']
        
        # Store the original data
        self.original_data = data.copy()
            
        # Handle any NaN or inf values
        data = data.replace([np.inf, -np.inf], np.nan).dropna()
        
        # Standardize the data
        data_std = (data - data.mean()) / data.std()
        
        # Set a very small sample size for initial testing
        self.sample_size = len(data_std)
        sample = data_std.iloc[:self.sample_size]
        
        # Store the sample index for reference
        self.sample_index = sample.index
        
        # Try with a simplified model first
        try:
            print("Trying with simplified model...")
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                model = MarkovRegression(sample, k_regimes=self.k, 
                                         trend='n',  # No trend
                                         switching_variance=False)  # No switching variance
                results = model.fit(disp=False)
                print("Simplified model succeeded!")
                self.method = "markov"
                return model, results
        except Exception as e:
            print(f"Simplified model failed: {e}")
        
        # Try with an even simpler approach - train a hidden Markov model
        try:
            print("Trying with different approach - K-means clustering...")
            # Create a feature matrix for clustering
            features = pd.DataFrame({
                'value': data_std,
                'volatility': data_std.rolling(20).std().fillna(0)
            })
            
            # Fit K-means
            kmeans = KMeans(n_clusters=self.k, random_state=42)
            regimes = kmeans.fit_predict(features)
            
            # Create a DataFrame with the results
            results_df = pd.DataFrame({
                'value': data_std,
                'regime': regimes
            })
            
            # Create probabilities (1 for assigned cluster, 0 for others)
            for i in range(self.k):
                results_df[f'regime_prob_{i}'] = (regimes == i).astype(float)
            
            self.method = "kmeans"
            self.kmeans_model = kmeans
            return kmeans, results_df
        except Exception as e:
            print(f"K-means approach failed: {e}")
            self.method = None
            return None, None
    
    def fit(self, data, exog=None):
        """Public method to fit the model"""
        self.model, self.results = self._fit_model(data, exog)
        return self.results
    
    def plot_regimes(self, original_data, saveDir=None):
        """Plot the regimes"""
        if self.method is None:
            print("No model was successfully fitted.")
            return None
            
        if self.method == "kmeans":
            results_df = self.results
            
            # Create figure with 3 subplots
            fig, axes = plt.subplots(3, 1, figsize=(12, 10), sharex=True)
            
            # Plot the original data
            axes[0].plot(results_df['value'])
            axes[0].set_title('Standardized Data')
            
            # Plot regime probabilities
            for i in range(self.k):
                axes[1].plot(results_df[f'regime_prob_{i}'], label=f'Regime {i}')
            axes[1].set_title('Regime Probabilities')
            axes[1].legend()
            
            # Plot the assigned regimes
            axes[2].scatter(range(len(results_df)), results_df['value'], 
                           c=results_df['regime'], cmap='viridis')
            axes[2].set_title('Data Points Colored by Regime')
            
            plt.tight_layout()
            if saveDir:
                plt.savefig(f"{saveDir}/visuals/regime_detection_kmeans.png")
            plt.show()
            
            # Return the regime assignments and probabilities
            return results_df
            
        elif self.method == "markov":
            # We only have results for the sample - just visualize what we have
            filtered_probs = self.results.filtered_marginal_probabilities
            
            # Create a results dataframe for just the sample
            results_df = pd.DataFrame(index=self.sample_index)
            
            # Add the original values
            results_df['value'] = self.original_data.loc[self.sample_index]
            
            # Add the probabilities
            for i in range(self.k):
                results_df[f'regime_prob_{i}'] = filtered_probs[i]
            
            # Assign the most likely regime
            results_df['regime'] = np.argmax(np.column_stack([filtered_probs[i] for i in range(self.k)]), axis=1)
            
            # Create plots
            plt.figure(figsize=(12, 8))
            for i in range(self.k):
                plt.plot(results_df.index, filtered_probs[i], label=f'Regime {i+1}')
            
            plt.title(f'Filtered Regime Probabilities (First {self.sample_size} points)')
            plt.xlabel('Time')
            plt.ylabel('Probability')
            plt.legend()
            if saveDir:
                plt.savefig(f"{saveDir}/visuals/markov_regimes.png")
            plt.show()
            
            # Plot the data points colored by regime
            plt.figure(figsize=(12, 6))
            plt.scatter(results_df.index, results_df['value'], c=results_df['regime'], cmap='viridis')
            plt.title(f'Data Points Colored by Regime (First {self.sample_size} points)')
            plt.xlabel('Time')
            plt.ylabel('Value')
            if saveDir:
                plt.savefig(f"{saveDir}/visuals/markov_regimes_scatter.png")
            plt.show()
            
            return results_df
        
    def predict_regimes_for_full_dataset(self, data):
        """Apply the fitted model to predict regimes for the full dataset"""
        if self.method == "kmeans":
            # For K-means, we can apply the model to the full dataset

            # Prepare features for the full dataset
            if isinstance(data, pd.Series):
                data_std = (data - data.mean()) / data.std()
                features = pd.DataFrame({
                    'value': data_std,
                    'volatility': data_std.rolling(20).std().fillna(0)
                })
            else:
                # Assume data is a DataFrame with 'forecast_vol'
                data_std = (data['forecast_vol'] - data['forecast_vol'].mean()) / data['forecast_vol'].std()
                features = pd.DataFrame({
                    'value': data_std,
                    'volatility': data_std.rolling(20).std().fillna(0)
                })

            # Predict regimes
            regimes = self.kmeans_model.predict(features)

            # Create a DataFrame with the results
            results_df = pd.DataFrame(index=data.index)
            results_df['regime'] = regimes

            # Create probabilities (1 for assigned cluster, 0 for others)
            for i in range(self.k):
                results_df[f'regime_prob_{i}'] = (regimes == i).astype(float)

            return results_df

        elif self.method == "markov":
            # For Markov switching, we can't easily extend to the full dataset
            # Instead, return the regimes for the sample with a warning
            print("Warning: Markov switching model was only trained on a small sample.")
            print(f"Returning regimes only for the first {self.sample_size} points.")

            filtered_probs = self.results.filtered_marginal_probabilities
            results_df = pd.DataFrame(index=self.sample_index)

            # Add the probabilities
            for i in range(self.k):
                results_df[f'regime_prob_{i}'] = filtered_probs[i]

            # Assign the most likely regime
            results_df['regime'] = np.argmax(np.column_stack([filtered_probs[i] for i in range(self.k)]), axis=1)

            return results_df
        else:
            print("No model was successfully fitted.")
            return None