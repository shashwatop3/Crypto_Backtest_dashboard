import gdown

# Define the Google Drive direct download link
url = 'https://drive.google.com/uc?id=1p6wOzt7PR9onf2f5oo_Q3Vn6g0bosnQL'
url2 = 'https://drive.google.com/uc?id=1qz4OPrHVwUfuKCSjvx-pa_QfiJxKcE9E'
# Define the destination path where the file will be saved
destination = 'data/btcusd_15min_preprcd.parquet'
destination2 = 'data/btcusd_15min_preprcd_with_regimes.parquet'
# Download the file from Google Drive
gdown.download(url, destination, quiet=False)
gdown.download(url2, destination2, quiet=False)
