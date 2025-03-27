import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const options = {
  method: 'GET',
  url: 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1',
  headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-hFwtN8u4wrNbmDLFA9VEac88' }
};

export const useBitcoinData = () => {
  return useQuery({
    queryKey: ["bitcoinData"],
    queryFn: async () => {
      try {
        const res = await axios(options);
        return res.data.prices;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || "An error occurred");
      }
    },
    staleTime: 1000 * 60 * 15, // 15 minutes cache // Refetch every 15 minutes
  });
};